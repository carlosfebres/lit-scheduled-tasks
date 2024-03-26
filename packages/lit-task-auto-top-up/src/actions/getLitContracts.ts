import { LitContracts } from '@lit-protocol/contracts-sdk';

import getConfig from './getConfig';
import LitContractsInstance from '../Classes/LitContractsInstance';

const instance = new LitContractsInstance({ config: getConfig() });

export default function getLitContractsInstance(): LitContracts {
  return instance.litContracts;
}
