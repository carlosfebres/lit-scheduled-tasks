import { Job } from '@hokify/agenda';
import awaity from 'awaity'; // Awaity is a cjs package, breaks `import` with named imports in ESM
import { ConsolaInstance } from 'consola';
import VError from 'verror';

import { mintCapacityCreditNFT } from '../actions/mintCapacityCreditNFT';
import { transferCapacityTokenNFT } from '../actions/transferCapacityTokenNFT';
import { toErrorWithMessage } from '../errors';
import { getRecipientList } from '../singletons/getRecipientList';
import { tryTouchTask, printTaskResultsAndFailures } from '../taskHelpers';
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

    const capacityTokenIdStr = await mintCapacityCreditNFT({ recipientDetail });
    await transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress });

    return { capacityTokenIdStr, ...recipientDetail };
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

          this.logger.log(`Finished top-up for ${recipientDetail.recipientAddress}`);
          tryTouchTask(task).then(() => true); // Fire-and-forget; touching job is not critical

          return settledResult;
        }
      );

      printTaskResultsAndFailures({ results, logger: this.logger });
    } catch (e) {
      const err = toErrorWithMessage(e);
      this.logger.error('CRITICAL ERROR', JSON.stringify(VError.info(err), null, 2));

      // Re-throw so the job is retried by the task worker
      throw err;
    }
  }
}
