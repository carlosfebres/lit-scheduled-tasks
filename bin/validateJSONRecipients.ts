import { recipientDetailSchema } from 'lit-task-auto-top-up';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

import habaneroRecipientList from '../worker/recipient_list_habanero.json' assert { type: 'json' };
import manzanoRecipientList from '../worker/recipient_list_manzano.json' assert { type: 'json' };

z.array(recipientDetailSchema).parse(habaneroRecipientList);
z.array(recipientDetailSchema).parse(manzanoRecipientList);
