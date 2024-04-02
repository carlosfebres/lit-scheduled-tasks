import { ConsolaInstance } from 'consola';
import { z } from 'zod';

import { TaskResultEnum } from './enums';
import { recipientDetailSchema, envConfigSchema } from './schemas';

export type EnvConfig = z.infer<typeof envConfigSchema>;
export type Config = { envConfig: EnvConfig; logger: ConsolaInstance };

export type RecipientDetail = z.infer<typeof recipientDetailSchema>;

export type TaskResult = TaskResultMinted | TaskResultSkipped;
export interface TaskResultMinted extends RecipientDetail {
  capacityTokenIdStr: string;
  result: TaskResultEnum.minted;
}

export interface TaskResultSkipped extends RecipientDetail {
  result: TaskResultEnum.skipped;
  unexpiredTokens: {
    expiresAt: string;
    tokenId: number;
  }[];
}
