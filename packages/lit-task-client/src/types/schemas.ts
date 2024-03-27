import { z } from 'zod';

// eslint-disable-next-line import/prefer-default-export
export const envConfigSchema = z
  .object({
    MONGO_DB_NAME: z.string(),
    MONGO_PASSWORD: z.string(),
    MONGO_SERVER: z.string(),
    MONGO_USER: z.string(),
  })
  .required();
