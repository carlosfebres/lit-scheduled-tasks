import { Job } from '@hokify/agenda';
import { ConsolaInstance } from 'consola';
import _ from 'lodash';
import VError, { MultiError } from 'verror';

import { TaskResult } from './types/types';

export function printTaskResultsAndFailures({
  logger,
  results,
}: {
  logger: ConsolaInstance;
  results: PromiseSettledResult<TaskResult>[];
}) {
  const fulfilled = results.filter(
    (r): r is PromiseFulfilledResult<TaskResult> => r.status === 'fulfilled'
  );
  const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

  const errors = rejected.map(({ reason }: { reason: Error }) => reason);
  const successes = fulfilled.map(({ value }) => value);

  logger.log(`Succeeded topping off ${successes.length} recipients`);
  _.forEach(successes, (r) => {
    const { recipientAddress, ...rest } = r;
    logger.log(`Minted for ${recipientAddress}`, rest);
  });

  if (errors.length > 0) {
    logger.log(`Failed to top off ${errors.length} recipients`);
    _.forEach(errors, (error) => {
      logger.error(error, JSON.stringify(VError.info(error), null, 2));
    });

    if (results.length > 1 && results.length === errors.length) {
      // If every single attempt to mint failed, we should assume something pretty bad is wrong and make the job fail entirely
      throw VError.errorFromList(errors) as MultiError;
    }
  } else {
    logger.log('All recipients were topped off successfully.');
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
