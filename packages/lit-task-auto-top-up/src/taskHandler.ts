import { Job } from '@hokify/agenda';
import { mapLimit } from 'awaity';
import consola from 'consola';

import fetchRecipientList from './actions/getRecipientList';
import mintCapacityCreditNFT from './actions/mintCapacityCreditNFT';
import transferCapacityTokenNFT from './actions/transferCapacityTokenNFT';
import { printTaskResultsAndFailures, tryTouchTask } from './taskHelpers';
import { TaskResult, RecipientDetail } from './types/types';

export async function handleRecipient({
  recipientDetail,
}: {
  recipientDetail: RecipientDetail;
}): Promise<TaskResult> {
  const { recipientAddress } = recipientDetail;

  const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientDetail });
  await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

  return { capacityTokenIdStr, recipientAddress };
}

export async function handleTask(task: Job) {
  consola.log('Running auto-top-up task; fetching recipient list');

  const recipientList = await fetchRecipientList();
  consola.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

  const results = await mapLimit<RecipientDetail, PromiseSettledResult<TaskResult>>(
    recipientList,
    async (recipientDetail) => {
      const [settledResult] = await Promise.allSettled([handleRecipient({ recipientDetail })]);

      tryTouchTask(task).then(() => true); // Fire-and-forget; touching job is not critical

      return settledResult;
    },
    3 // Let us mint 3 at a time so this isn't too slow but isn't a spammy deluge
  );

  printTaskResultsAndFailures(results);
}
