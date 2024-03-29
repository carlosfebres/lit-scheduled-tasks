import { LitContracts } from '@lit-protocol/contracts-sdk';

import { Config } from '../types/types';

export class LitContractsInstance {
  private readonly contractsInstance: LitContracts;

  private isConnected: boolean = false;

  private connectHandle: Promise<boolean> | null = null;

  constructor(config: Config) {
    const {
      envConfig: { LIT_NETWORK, NFT_MINTER_KEY },
    } = config;
    this.contractsInstance = new LitContracts({
      debug: true,
      network: LIT_NETWORK,
      privateKey: NFT_MINTER_KEY,
    });
  }

  async connect(): Promise<boolean> {
    if (!this.isConnected) {
      // Coalesce concurrent calls
      if (this.connectHandle) {
        return this.connectHandle;
      }

      // Stash a handle so concurrent calls to connect are coaelesced into 1
      this.connectHandle = this.contractsInstance.connect().then(() => true);

      try {
        // Don't return until we know the result of pending connect attempt
        await this.connectHandle;
        this.isConnected = true;
      } catch (e) {
        // We allow multiple calls to (retries!) to `connect()` even in case where one succeeded
        // if `isConnected` is false (e.g. a prior attempt failed)
        this.isConnected = false;
        throw e;
      } finally {
        this.connectHandle = null;
      }
      return this.isConnected;
    }

    return true;
  }

  get litContracts(): LitContracts {
    return this.contractsInstance;
  }
}
