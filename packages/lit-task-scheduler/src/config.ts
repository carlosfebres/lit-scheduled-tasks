import { z } from 'zod';

const envConfigZodEnum = z.enum(['MONGO_PASSWORD', 'MONGO_SERVER', 'MONGO_USER', 'MONGO_DB_NAME']);
export type EnvConfig = { [K in z.infer<typeof envConfigZodEnum>]: string };
export const envConfigEnum = envConfigZodEnum.enum;

const envConfigSchema: z.ZodType<EnvConfig> = z
  .object({
    ...Object.keys(envConfigZodEnum.enum).reduce((obj, key) => ({ ...obj, [key]: z.string() }), {}),
  })
  .required() as z.ZodTypeAny;

/**
 * Loads configuration from process.env in a type-safe way (thanks Zod!)
 *
 * Throws immediately if any critical configuration is missing from process.env
 *
 * @returns {EnvConfig}
 */
export function getConfigFromEnv(env: any): EnvConfig {
  return envConfigSchema.parse(env);
}
