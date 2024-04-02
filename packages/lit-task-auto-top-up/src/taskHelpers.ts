import { Job } from '@hokify/agenda';
import { ConsolaInstance } from 'consola';
import _ from 'lodash';
import VError, { MultiError } from 'verror';

import { TaskResultEnum } from './types/enums';
import { TaskResult } from './types/types';

// This is so fly like superman, I gotta credit mmmmveggies. Extract<> is pretty cool.
// https://stackoverflow.com/a/63831756
function hasProp<K extends PropertyKey, V extends string | number | boolean>(k: K, v: V) {
  // All candidate types might have key `K` of any type
  type Candidate = Partial<Record<K, any>> | null | undefined;

  // All matching subtypes of T must have key `K` equal value `V`
  type Match<T extends Candidate> = Extract<T, Record<K, V>>;

  return <T extends Candidate>(obj: T): obj is Match<T> => obj?.[k] === v;
}

export function printTaskResultsAndFailures({
  logger,
  results,
}: {
  logger: ConsolaInstance;
  results: PromiseSettledResult<TaskResult>[];
}) {
  const fulfilled = results.filter(hasProp('status', 'fulfilled'));
  const rejected = results.filter(hasProp('status', 'rejected'));

  const errors = rejected.map(({ reason }: { reason: Error }) => reason);
  const mints = fulfilled
    .map(({ value }) => value)
    .filter(hasProp('result', TaskResultEnum.minted));
  const skips = fulfilled
    .map(({ value }) => value)
    .filter(hasProp('result', TaskResultEnum.skipped));

  if (skips.length > 0) {
    logger.log(`Skipped topping off ${skips.length} recipients`);
    _.forEach(skips, (r) => {
      const { recipientAddress, ...rest } = r;
      logger.log(`Skipped ${recipientAddress}`, rest);
    });
  }

  if (mints.length > 0) {
    logger.log(`Succeeded topping off ${mints.length} recipients`);
    _.forEach(mints, (r) => {
      const { recipientAddress, ...rest } = r;
      logger.log(`Minted for ${recipientAddress}`, rest);
    });
  }

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
    logger.log('All recipients were topped off successfully or skipped.');
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
