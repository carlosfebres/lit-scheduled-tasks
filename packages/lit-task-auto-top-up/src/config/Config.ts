import { z } from 'zod';

export const DEFAULT_RECIPIENT_LIST_URL =
  'https://raw.githubusercontent.com/LIT-Protocol/lit-scheduled-tasks/blob/main/recipient_list.json';

export const requiredConfigSchema = { FAUCET_ADDRESS: z.string().min(32), NFT_MINTER_KEY: z.string().min(32) };

export const optionalConfigSchema = {
  RECIPIENT_LIST_URL: z.string().default(DEFAULT_RECIPIENT_LIST_URL),
};

const envConfigSchema = z.intersection(z.object(requiredConfigSchema).required(), z.object(optionalConfigSchema));
export type EnvConfig = z.infer<typeof envConfigSchema>;

/**
 * Class that provides parsing of `process.env` using `zod` Env is only parsed during object construction -- from then
 * on, the `config` getter returns the previously parsed object. If for some reason you change `process.env`, or to test
 * multiple env configurations in the same process you'll need a new Config instance
 */
export default class Config {
  private readonly parsedConfig: EnvConfig;

  constructor(env: object = process.env) {
    this.parsedConfig = envConfigSchema.parse(env);
  }

  get config(): EnvConfig {
    return this.parsedConfig;
  }
}
