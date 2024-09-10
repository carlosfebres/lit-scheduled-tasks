import { recipientDetailSchema, SUPPORTED_LIT_NETWORKS } from 'lit-task-auto-top-up';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

import cayenneRecipientList from '../worker/recipient_list_cayenne.json' assert { type: 'json' };
import datilTestRecipientList from '../worker/recipient_list_datil-test.json' assert { type: 'json' };
import datilRecipientList from '../worker/recipient_list_datil.json' assert { type: 'json' };
import habaneroRecipientList from '../worker/recipient_list_habanero.json' assert { type: 'json' };
import manzanoRecipientList from '../worker/recipient_list_manzano.json' assert { type: 'json' };

const networks = SUPPORTED_LIT_NETWORKS.options;

// Ensures we are validating the shape of a recipient list for every network that we support
const recipientListsMap: Record<
  z.infer<typeof SUPPORTED_LIT_NETWORKS>,
  z.infer<typeof recipientDetailSchema>[]
> = {
  cayenne: cayenneRecipientList,
  datil: datilRecipientList,
  'datil-test': datilTestRecipientList,
  habanero: habaneroRecipientList,
  manzano: manzanoRecipientList,
};

networks.forEach((network: z.infer<typeof SUPPORTED_LIT_NETWORKS>) => {
  const list = recipientListsMap[network];

  if (!list) {
    throw new Error(`Missing recipient list at 'worker/recipient_list_${network}'`);
  }

  z.array(recipientDetailSchema).parse(list);
});
