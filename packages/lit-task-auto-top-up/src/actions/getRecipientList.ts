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

const recipientListInstance = new RecipientList(getConfig());

export default async function getRecipients(): Promise<RecipientDetail[]> {
  return recipientListInstance.fetchRecipientList();
}
