import getConfigSingleton from '../config/getConfigSingleton';
import { toErrorWithMessage } from '../errors';
import FetchRecipientListFailure from '../errors/FetchRecipientListFailure';

export default async function fetchRecipientList(): Promise<string[]> {
  // TODO: Clarify exactly what each element of this will include. Should we be parsing out quota data?
  const { RECIPIENT_LIST_URL } = getConfigSingleton();

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
