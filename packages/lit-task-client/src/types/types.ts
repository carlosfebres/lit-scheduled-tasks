import { ConsolaInstance } from 'consola';
import { z } from 'zod';

import { envConfigSchema } from './schemas';

export type EnvConfig = z.infer<typeof envConfigSchema>;
export type Config = { envConfig: EnvConfig; logger: ConsolaInstance };
