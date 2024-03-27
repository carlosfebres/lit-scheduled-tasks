import { LitContracts } from '@lit-protocol/contracts-sdk';

import getConfig from './getConfig';
import LitContractsInstance from '../Classes/LitContractsInstance';

const instance = new LitContractsInstance({ config: getConfig() });

export default async function getLitContractsInstance(): Promise<LitContracts> {
  await instance.connect();
  return instance.litContracts;
}
