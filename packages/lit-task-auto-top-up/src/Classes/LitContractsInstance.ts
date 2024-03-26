import { LitContracts } from '@lit-protocol/contracts-sdk';

import { EnvConfig } from '../types/types';

export default class LitContractsInstance {
  private readonly contractsInstance: LitContracts;

  constructor({ config }: { config: EnvConfig }) {
    const { NFT_MINTER_KEY } = config;
    this.contractsInstance = new LitContracts({ privateKey: NFT_MINTER_KEY });
  }

  get litContracts(): LitContracts {
    return this.contractsInstance;
  }
}
