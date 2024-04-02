import { Job } from '@hokify/agenda';
import awaity from 'awaity'; // Awaity is a cjs package, breaks `import` with named imports in ESM
import { ConsolaInstance } from 'consola';
import date from 'date-and-time';
import VError from 'verror';

import { mintCapacityCreditNFT } from '../actions/mintCapacityCreditNFT';
import { transferCapacityTokenNFT } from '../actions/transferCapacityTokenNFT';
import { toErrorWithMessage } from '../errors';
import { getLitContractsInstance } from '../singletons/getLitContracts';
import { getRecipientList } from '../singletons/getRecipientList';
import { tryTouchTask, printTaskResultsAndFailures } from '../taskHelpers';
import { TaskResultEnum } from '../types/enums';
import { Config, EnvConfig, RecipientDetail, TaskResult } from '../types/types';

const { mapSeries } = awaity;

export class TaskHandler {
  private envConfig: EnvConfig;

  private logger: ConsolaInstance;

  constructor({ config }: { config: Config }) {
    const { envConfig, logger } = config;
    this.envConfig = envConfig;
    this.logger = logger;
  }

  async handleRecipient({
    recipientDetail,
  }: {
    recipientDetail: RecipientDetail;
  }): Promise<TaskResult> {
    const { recipientAddress } = recipientDetail;
    const { noUnexpiredTokensTomorrow, unexpiredTokens } = await this.getExistingTokenDetails({
      recipientAddress,
    });

    if (noUnexpiredTokensTomorrow) {
      const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientDetail });
      await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

      return { capacityTokenIdStr, result: TaskResultEnum.minted, ...recipientDetail };
    }

    // If we got here, there should be some `unexpiredTokens` to log for clarity later.
    return {
      ...recipientDetail,
      unexpiredTokens,
      result: TaskResultEnum.skipped,
    };
  }

  private async getExistingTokenDetails({ recipientAddress }: { recipientAddress: string }) {
    const tomorrow = date.addDays(new Date(), 1);
    const litContracts = await getLitContractsInstance();

    // :sad_panda:, `getTokensByOwnerAddress()` returns <any> :(
    const existingTokens: {
      URI: { description: string; image_data: string; name: string };
      capacity: {
        expiresAt: { formatted: string; timestamp: number };
        requestsPerMillisecond: number;
      };
      isExpired: boolean;
      tokenId: number;
    }[] =
      await litContracts.rateLimitNftContractUtils.read.getTokensByOwnerAddress(recipientAddress);

    // Only mint a new token if the recipient...
    // 1. Has no NFTs at all
    // 2. All unexpired NFTs they have will expire tomorrow
    // 3. All of their NFTs are already expired
    const noUnexpiredTokensTomorrow = existingTokens.every((token) => {
      // NOTE: `every()` on an empty array === true :)
      const {
        capacity: {
          expiresAt: { timestamp },
        },
        isExpired,
      } = token;
      if (isExpired) {
        return true;
      }
      return date.isSameDay(new Date(timestamp), tomorrow);
    });
    return {
      noUnexpiredTokensTomorrow,
      unexpiredTokens: existingTokens
        .filter(({ isExpired }) => !isExpired)
        .map(
          ({
            capacity: {
              expiresAt: { formatted },
            },
            tokenId,
          }) => ({
            tokenId,
            expiresAt: formatted,
          })
        ),
    };
  }

  async handleTask(task: Job) {
    this.logger.log('Running auto-top-up task; fetching recipient list');

    try {
      const recipientList = await getRecipientList();
      this.logger.log(`Loaded ${recipientList.length} recipient addresses from JSON`);

      const results = await mapSeries<RecipientDetail, PromiseSettledResult<TaskResult>>(
        recipientList,
        async (recipientDetail) => {
          const [settledResult] = await Promise.allSettled([
            this.handleRecipient({ recipientDetail }),
          ]);

          this.logger.log(`Finished processing ${recipientDetail.recipientAddress}`);
          tryTouchTask(task).then(() => true); // Fire-and-forget; touching job is not critical

          return settledResult;
        }
      );

      printTaskResultsAndFailures({ results, logger: this.logger });
    } catch (e) {
      const err = toErrorWithMessage(e);
      this.logger.error('CRITICAL ERROR', e, JSON.stringify(VError.info(err), null, 2));

      // Re-throw so the job is retried by the task worker
      throw err;
    }
  }
}
