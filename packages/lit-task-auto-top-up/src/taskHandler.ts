import { Job } from '@hokify/agenda';
import awaity from 'awaity'; // Awaity is a cjs package, breaks `import` with named imports in ESM
import VError from 'verror';

import getConfig from './actions/getConfig';
import getRecipientList from './actions/getRecipientList';
import mintCapacityCreditNFT from './actions/mintCapacityCreditNFT';
import transferCapacityTokenNFT from './actions/transferCapacityTokenNFT';
import { toErrorWithMessage } from './errors';
import { printTaskResultsAndFailures, tryTouchTask } from './taskHelpers';
import { TaskResult, RecipientDetail } from './types/types';

const { mapSeries } = awaity;

// Intentionally calling `getConfig()` in the task handler's module scope
// So that the entire environment will crash/fail to start if the environment is not sane,
// rather than crashing the first time the job is loaded at some time in the future
const { logger } = getConfig();

export async function handleRecipient({
  recipientDetail,
}: {
  recipientDetail: RecipientDetail;
}): Promise<TaskResult> {
  const { recipientAddress } = recipientDetail;

  const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientDetail });
  await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

  return { capacityTokenIdStr, ...recipientDetail };
}

export async function handleTask(task: Job) {
  logger.log('Running auto-top-up task; fetching recipient list');

  try {
    const recipientList = await getRecipientList();
    logger.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

    const results = await mapSeries<RecipientDetail, PromiseSettledResult<TaskResult>>(
      recipientList,
      async (recipientDetail) => {
        const [settledResult] = await Promise.allSettled([handleRecipient({ recipientDetail })]);

        logger.log(`Finished top-up for ${recipientDetail.recipientAddress}`);
        tryTouchTask(task).then(() => true); // Fire-and-forget; touching job is not critical

        return settledResult;
      }
    );

    printTaskResultsAndFailures({ logger, results });
  } catch (e) {
    const err = toErrorWithMessage(e);
    logger.error('CRITICAL ERROR', JSON.stringify(VError.info(err), null, 2));

    // Re-throw so the job is retried by the task worker
    throw err;
  }
}
