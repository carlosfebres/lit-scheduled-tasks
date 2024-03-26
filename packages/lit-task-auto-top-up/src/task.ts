import awaity from 'awaity';
import consola from 'consola';
import _ from 'lodash';
import VError from 'verror';

import fetchRecipientList from './actions/fetchRecipientList';
import mintCapacityCreditNFT from './actions/mintCapacityCreditNFT';
import transferCapacityTokenNFT from './actions/transferCapacityTokenNFT';
import { TaskResult } from './types/types';

import type { Job } from '@hokify/agenda';

const { mapLimit } = awaity;

async function tryTouchJob(job: Job) {
  try {
    // Try to push lock time for the job out to avoid lock expiring while we're working
    // Just in case things are running extra slow
    await job.touch();
  } catch (e) {
    // Squelch!  This is a non-critical failure
  }
}

/**
 * Processes a single recipient record
 *
 * 1. Mints a new Capacity Credit NFT using our env-provided source account
 * 2. Transfers that NFT to the target recipient
 *
 * @param {string} recipientAddress
 * @returns {Promise<TaskResult>}
 */
async function handleRecipient({ recipientAddress }: { recipientAddress: string }): Promise<TaskResult> {
  const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientAddress });
  await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

  return { capacityTokenIdStr, recipientAddress };
}

// Probably will repeat in multiple tasks. Move to lit-task-utils or similar? Is generic enough to.
function printTaskResultsAndFailures(results: PromiseSettledResult<TaskResult>[]) {
  const fulfilled = results.filter((r): r is PromiseFulfilledResult<TaskResult> => r.status === 'fulfilled');
  const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

  const errors = rejected.map(({ reason }: { reason: Error }) => reason);
  const successes = fulfilled.map(({ value }) => value);

  consola.log(`Succeeded topping off ${successes.length} recipients`);
  _.forEach(successes, ({ capacityTokenIdStr, recipientAddress }) => {
    consola.log(`Minted for ${recipientAddress}`, capacityTokenIdStr);
  });

  consola.log(`Failed to top off ${successes.length} recipients`);
  _.forEach(errors, (error) => {
    consola.error(error, JSON.stringify(VError.info(error), null, 2));
  });
}

export default async function autoTopUpTask(job: Job) {
  consola.log('Running auto-top-up task; fetching recipient list');

  const recipientList = await fetchRecipientList();
  consola.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

  const results = await mapLimit<string, PromiseSettledResult<TaskResult>>(
    recipientList,
    async (recipientAddress) => {
      const [settledResult] = await Promise.allSettled([handleRecipient({ recipientAddress })]);

      tryTouchJob(job).then(() => true); // Fire-and-forget; touching job is not critical

      return settledResult;
    },
    3 // Let us mint 3 at a time so this isn't too slow but isn't a spammy deluge
  );

  printTaskResultsAndFailures(results);
}
