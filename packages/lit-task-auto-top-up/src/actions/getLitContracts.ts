import { LitContracts } from '@lit-protocol/contracts-sdk';

import getConfig from './getConfig';
import LitContractsInstance from '../Classes/LitContractsInstance';

let instance: LitContractsInstance | null = null;

export default async function getLitContractsInstance(): Promise<LitContracts> {
  if (instance) {
    // connect() is idempotent; if we're retrying from outside, attempt to connect again
    // This is a no-op if already connected 🎉 but if a prior attempt fails, it'll try again.
    await instance.connect();
    return instance.litContracts;
  }

  instance = new LitContractsInstance(getConfig());
  await instance.connect();

  return instance.litContracts;
}
