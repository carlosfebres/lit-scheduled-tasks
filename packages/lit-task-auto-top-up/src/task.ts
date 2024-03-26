import awaity from 'awaity';
import consola from 'consola';
import _ from 'lodash';
import VError from 'verror';

import { LitContracts } from '@lit-protocol/contracts-sdk';

import { toErrorWithMessage } from './errors';
import FetchRecipientListFailure from './errors/FetchRecipientListFailure';
import MintCapacityTokenFailure from './errors/MintCapacityTokenFailure';
import TransferCapacityTokenFailure from './errors/TransferCapacityTokenFailure';

import type { Job } from '@hokify/agenda';

const { mapLimit } = awaity;

const FAUCET_ADDRESS = '';
const RECIPIENT_LIST_URL =
  'https://raw.githubusercontent.com/LIT-Protocol/lit-scheduled-tasks/blob/main/recipient_list.json';

// TODO: Load private key from env, set on contracts instance for local signing of mint & transfer txs
const contracts = new LitContracts();

// TODO: Clarify exactly what each element of this will include. Should we be parsing out quota data?
async function fetchRecipientList(): Promise<string[]> {
  try {
    const res = await fetch(RECIPIENT_LIST_URL);
    const list = await res.json();

    return list as string[];
  } catch (e) {
    const err = toErrorWithMessage(e);
    throw new FetchRecipientListFailure(
      {
        cause: err,
        info: {
          RECIPIENT_LIST_URL,
        },
        name: 'FetchRecipientListFailure',
      },
      'Failed to fetch JSON list of recipient addresses'
    );
  }
}

async function mintCapacityCreditNFT({ recipientAddress }: { recipientAddress: string }) {
  try {
    const { capacityTokenIdStr } = await contracts.mintCapacityCreditsNFT({
      daysUntilUTCMidnightExpiration: 1,
      requestsPerDay: 1000,
      requestsPerKilosecond: 10,
      requestsPerSecond: 10,
    });

    return capacityTokenIdStr;
  } catch (e) {
    const err = toErrorWithMessage(e);

    throw new MintCapacityTokenFailure(
      {
        cause: err,
        info: {
          recipientAddress,
        },
        name: 'MintCapacityTokenFailure',
      },
      'Failed to mint capacity token'
    );
  }
}

async function transferCapacityTokenNFT({
  capacityTokenIdStr,
  recipientAddress,
}: {
  capacityTokenIdStr: string;
  recipientAddress: string;
}) {
  try {
    await contracts.rateLimitNftContractUtils.write.transfer({
      fromAddress: FAUCET_ADDRESS,
      RLITokenAddress: capacityTokenIdStr,
      toAddress: recipientAddress,
    });
  } catch (e) {
    const err = toErrorWithMessage(e);

    throw new TransferCapacityTokenFailure(
      {
        cause: err,
        info: {
          capacityTokenIdStr,
          recipientAddress,
        },
        name: 'TransferCapacityTokenFailure',
      },
      'Failed to transfer capacity token'
    );
  }
}

async function handleRecipient({ recipientAddress }: { recipientAddress: string }): Promise<string> {
  const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientAddress });
  await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

  // FIXME; Return recipient plus capacity token ID
  return capacityTokenIdStr;
}

interface SettledResultsGroup<T> {
  fulfilled: PromiseFulfilledResult<T>[];
  rejected: PromiseRejectedResult[];
}

async function tryTouchJob(job: Job) {
  try {
    // Try to push lock time for the job out to avoid lock expiring while we're working
    // Just in case things are running extra slow
    await job.touch();
  } catch (e) {
    // Squelch!  This is a non-critical failure
  }
}

export default async function autoTopUpTask(job: Job) {
  consola.log('Running auto-top-up task; fetching recipient list');

  const recipientList = await fetchRecipientList();
  consola.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

  const results = await mapLimit<string, PromiseSettledResult<string>>(
    recipientList,
    async (recipientAddress) => {
      const [settledResult] = await Promise.allSettled([handleRecipient({ recipientAddress })]);
      await tryTouchJob(job);
      return settledResult;
    },
    3 // Let us mint 3 at a time so this isn't too slow but isn't a spammy deluge
  );

  // TODO: Feels like this shouldn't require an 'as unknown as SettledResultsGroup'
  const { fulfilled, rejected }: SettledResultsGroup<string> = _.groupBy(results, (value) => {
    const { status } = value;
    if (status === 'fulfilled') {
      return value as PromiseFulfilledResult<string>;
    }

    return value as PromiseRejectedResult;
  }) as unknown as SettledResultsGroup<string>;

  const errors = rejected.map(({ reason }: { reason: Error }) => reason);
  const successes = fulfilled.map(({ value }) => value);

  consola.log(`Succeeded topping off ${successes.length} recipients`);
  consola.log({ successes });

  consola.log(`Failed to top off ${successes.length} recipients`);
  _.forEach(errors, (error) => {
    consola.error(error, VError.info(error));
  });
}
