import { LitContracts } from '@lit-protocol/contracts-sdk';

import getConfigSingleton from './config/getConfigSingleton';

const instance: null | LitContracts = null;

export default function getLitContractsInstance() {
  if (instance) {
    return instance;
  }

  const { NFT_MINTER_KEY } = getConfigSingleton();
  return new LitContracts({ privateKey: NFT_MINTER_KEY });
}
