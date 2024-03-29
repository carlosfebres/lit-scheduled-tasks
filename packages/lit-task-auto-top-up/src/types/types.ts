import { ConsolaInstance } from 'consola';
import { z } from 'zod';

import { recipientDetailSchema, envConfigSchema } from './schemas';

export type EnvConfig = z.infer<typeof envConfigSchema>;
export type Config = { envConfig: EnvConfig; logger: ConsolaInstance };

export type RecipientDetail = z.infer<typeof recipientDetailSchema>;

export interface TaskResult extends RecipientDetail {
  capacityTokenIdStr: string;
}
