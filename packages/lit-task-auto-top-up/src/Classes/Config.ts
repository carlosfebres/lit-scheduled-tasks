import { envConfigSchema } from '../types/schemas';
import { EnvConfig } from '../types/types';

/**
 * Class that provides parsing of `process.env` using `zod` Env is only parsed during object
 * construction -- from then on, the `config` getter returns the previously parsed object. If for
 * some reason you change `process.env`, or to test multiple env configurations in the same process
 * you'll need a new Config instance
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
