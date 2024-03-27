import { ConsolaInstance } from 'consola';

import { toErrorWithMessage } from '../errors';
import FetchRecipientListFailure from '../errors/FetchRecipientListFailure';
import { recipientDetailsListSchema } from '../types/schemas';
import { EnvConfig, RecipientDetail, Config } from '../types/types';

export default class RecipientList {
  private recipientList: RecipientDetail[] = [];

  private readonly envConfig: EnvConfig;

  private logger: ConsolaInstance;

  constructor(config: Config) {
    const { envConfig, logger } = config;
    this.logger = logger;
    this.envConfig = envConfig;
  }

  async getRecipientList(): Promise<RecipientDetail[]> {
    try {
      this.recipientList = await this.fetchRecipientList();
    } catch (e) {
      const err = toErrorWithMessage(e);

      if (!this.recipientList.length) {
        // If we have never loaded a list and can't use cached, then fail the job hard.
        throw err;
      }

      this.logger.error('Failed to fetch/parse recipient list', err.toString());
      this.logger.log('Using last known good recipient list.');
    }

    return this.recipientList;
  }

  async fetchRecipientList(): Promise<RecipientDetail[]> {
    const { RECIPIENT_LIST_URL } = this.envConfig;

    this.logger.log('Fetching recipients list', { RECIPIENT_LIST_URL });

    try {
      const res = await fetch(RECIPIENT_LIST_URL);
      const list = await res.json();
      return recipientDetailsListSchema.parse(list);
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
}
