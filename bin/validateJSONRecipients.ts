import { recipientDetailSchema, SUPPORTED_LIT_NETWORKS } from 'lit-task-auto-top-up';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

import rawDatilTestRecipientList from '../worker/recipient_list_datil-test.json' assert { type: 'json' };
import rawDatilRecipientList from '../worker/recipient_list_datil.json' assert { type: 'json' };

const recipientListSchema = z.array(recipientDetailSchema);

const datilTestRecipientList = recipientListSchema.parse(rawDatilTestRecipientList);
const datilRecipientList = recipientListSchema.parse(rawDatilRecipientList);

// Ensures we are validating the shape of a recipient list for every network that we support
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recipientListsMap: Record<
  z.infer<typeof SUPPORTED_LIT_NETWORKS>,
  z.infer<typeof recipientDetailSchema>[]
> = {
  datil: datilRecipientList,
  'datil-test': datilTestRecipientList,
};

// Also check at runtime, just in case.
const networks = SUPPORTED_LIT_NETWORKS.options;
networks.forEach((network: z.infer<typeof SUPPORTED_LIT_NETWORKS>) => {
  const list = recipientListsMap[network];

  if (!list) {
    throw new Error(`Missing recipient list at 'worker/recipient_list_${network}'`);
  }
});
