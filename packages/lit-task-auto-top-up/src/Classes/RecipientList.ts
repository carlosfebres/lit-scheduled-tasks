import consola from 'consola';

import getConfig from '../actions/getConfig';
import { toErrorWithMessage } from '../errors';
import FetchRecipientListFailure from '../errors/FetchRecipientListFailure';
import { recipientDetailsListSchema } from '../types/schemas';
import { EnvConfig, RecipientDetail } from '../types/types';

export default class RecipientList {
  private recipientList: RecipientDetail[] = [];

  private readonly config: EnvConfig;

  constructor() {
    this.config = getConfig();
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

      consola.error('Failed to fetch/parse recipient list', err.toString());
      consola.log('Using last known good recipient list.');
    }

    return this.recipientList;
  }

  async fetchRecipientList(): Promise<RecipientDetail[]> {
    const { RECIPIENT_LIST_URL } = this.config;

    consola.log('Fetching recipients list', { RECIPIENT_LIST_URL });

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
