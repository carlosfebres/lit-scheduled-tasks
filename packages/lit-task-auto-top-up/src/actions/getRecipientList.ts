/**
 * `getRecipients`returns singleton instance of the RecipientsList class, which is initialized at
 * module-scope when this module is loaded.
 *
 * We maintain an instance here to facilitate persisting the 'last known good' list of recipients
 * that we have parsed
 */
import getConfig from './getConfig';
import RecipientList from '../Classes/RecipientList';
import { RecipientDetail } from '../types/types';

let recipientListInstance: RecipientList | null;

export default async function getRecipientList(): Promise<RecipientDetail[]> {
  if (recipientListInstance) {
    return recipientListInstance.getRecipientList();
  }
  recipientListInstance = new RecipientList(getConfig());

  return recipientListInstance.getRecipientList();
}
