import consola, { ConsolaInstance } from 'consola';

import { envConfigSchema } from '../types/schemas';
import { EnvConfig, Config } from '../types/types';

/**
 * Class that provides parsing of `process.env` using `zod` Env is only parsed during object
 * construction -- from then on, the `config` getter returns the previously parsed object. If for
 * some reason you change `process.env`, or to test multiple env configurations in the same process
 * you'll need a new Config instance
 */
export class ConfigParser {
  private readonly parsedConfig: EnvConfig;

  private logger: ConsolaInstance = consola.withTag('lit-task-auto-top-up');

  constructor(env: object = process.env) {
    this.parsedConfig = envConfigSchema.parse(env);

    const { LIT_NETWORK, NFT_MINTER_ADDRESS, RECIPIENT_LIST_URL } = this.parsedConfig;
    this.logger.log('Env configuration loaded', {
      LIT_NETWORK,
      NFT_MINTER_ADDRESS,
      RECIPIENT_LIST_URL,
    });
  }

  get config(): Config {
    return { envConfig: this.parsedConfig, logger: this.logger };
  }
}
