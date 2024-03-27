import { LitContracts } from '@lit-protocol/contracts-sdk';

import { EnvConfig } from '../types/types';

export default class LitContractsInstance {
  private readonly contractsInstance: LitContracts;

  private isConnected: boolean = false;

  constructor({ config }: { config: EnvConfig }) {
    const { LIT_NETWORK, NFT_MINTER_KEY } = config;
    this.contractsInstance = new LitContracts({
      debug: true,
      network: LIT_NETWORK,
      privateKey: NFT_MINTER_KEY,
    });
  }

  async connect(): Promise<boolean> {
    if (!this.isConnected) {
      return this.contractsInstance.connect().then(() => true);
    }

    return true;
  }

  get litContracts(): LitContracts {
    return this.contractsInstance;
  }
}
