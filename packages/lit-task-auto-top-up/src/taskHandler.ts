import { Job } from '@hokify/agenda';
import awaity from 'awaity'; // Awaity is a cjs package, breaks `import` with named imports in ESM
import consola from 'consola';
import VError from 'verror';

import fetchRecipientList from './actions/getRecipientList';
import mintCapacityCreditNFT from './actions/mintCapacityCreditNFT';
import transferCapacityTokenNFT from './actions/transferCapacityTokenNFT';
import { toErrorWithMessage } from './errors';
import { printTaskResultsAndFailures, tryTouchTask } from './taskHelpers';
import { TaskResult, RecipientDetail } from './types/types';

const { mapSeries } = awaity;

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
  consola.log('Running auto-top-up task; fetching recipient list');

  try {
    const recipientList = await fetchRecipientList();
    consola.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

    const results = await mapSeries<RecipientDetail, PromiseSettledResult<TaskResult>>(
      recipientList,
      async (recipientDetail) => {
        const [settledResult] = await Promise.allSettled([handleRecipient({ recipientDetail })]);

        consola.log(`Finished top-up for ${recipientDetail.recipientAddress}`);
        tryTouchTask(task).then(() => true); // Fire-and-forget; touching job is not critical

        return settledResult;
      }
    );

    printTaskResultsAndFailures(results);
  } catch (e) {
    const err = toErrorWithMessage(e);
    consola.error('CRITICAL ERROR', JSON.stringify(VError.info(err), null, 2));

    // Re-throw so the job is retried by the task worker
    throw err;
  }
}
