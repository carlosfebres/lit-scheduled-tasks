import { recipientDetailSchema } from 'lit-task-auto-top-up';
// eslint-disable-next-line import/no-extraneous-dependencies
import { z } from 'zod';

import recipientList from '../worker/recipient_list.json' assert { type: 'json' };

z.array(recipientDetailSchema).parse(recipientList);
