import consola, { ConsolaInstance } from 'consola';

import { envConfigSchema } from '../types/schemas';
import { EnvConfig, Config } from '../types/types';

/**
 * Class that provides parsing of `process.env` using `zod` Env is only parsed during object
 * construction -- from then on, the `config` getter returns the previously parsed object. If for
 * some reason you change `process.env`, or to test multiple env configurations in the same process
 * you'll need a new Config instance
 */
export default class ConfigParser {
  private readonly parsedConfig: EnvConfig;

  private logger: ConsolaInstance = consola.withTag('lit-task-scheduler');

  constructor(env: object = process.env) {
    this.parsedConfig = envConfigSchema.parse(env);

    const { MONGO_DB_NAME, MONGO_SERVER, MONGO_USER } = this.parsedConfig;
    this.logger.log('Env configuration loaded', {
      MONGO_DB_NAME,
      MONGO_SERVER,
      MONGO_USER,
    });
  }

  get config(): Config {
    return { envConfig: this.parsedConfig, logger: this.logger };
  }
}
