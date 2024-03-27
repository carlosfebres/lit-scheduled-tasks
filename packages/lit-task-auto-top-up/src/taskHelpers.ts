import { Job } from '@hokify/agenda';
import consola from 'consola';
import _ from 'lodash';
import VError from 'verror';

import { TaskResult } from './types/types';

export function printTaskResultsAndFailures(results: PromiseSettledResult<TaskResult>[]) {
  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<TaskResult> => r.status === 'fulfilled'
  );
  const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

  const errors = rejected.map(({ reason }: { reason: Error }) => reason);
  const successes = fulfilled.map(({ value }) => value);

  consola.log(`Succeeded topping off ${successes.length} recipients`);
  _.forEach(successes, (r) => {
    const { recipientAddress, ...rest } = r;
    consola.log(`Minted for ${recipientAddress}`, rest);
  });

  consola.log(`Failed to top off ${errors.length} recipients`);
  _.forEach(errors, (error) => {
    consola.error(error, JSON.stringify(VError.info(error), null, 2));
  });

  if (successes.length > 0 && successes.length === errors.length) {
    // If every single attempt to mint failed, we should assume something pretty bad is wrong and make the job fail entirely
    throw VError.errorFromList(errors);
  }
}

export async function tryTouchTask(task: Job) {
  try {
    // Try to push lock time for the job out to avoid lock expiring while we're working
    // Just in case things are running extra slow
    await task.touch();
  } catch (e) {
    // Squelch!  This is a non-critical failure
  }
}
