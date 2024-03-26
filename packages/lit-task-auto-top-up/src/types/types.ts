import { z } from 'zod';

import { recipientDetailSchema, envConfigSchema } from './schemas';

export type EnvConfig = z.infer<typeof envConfigSchema>;
export type RecipientDetail = z.infer<typeof recipientDetailSchema>;

export interface TaskResult {
  capacityTokenIdStr: string;
  recipientAddress: string;
}
