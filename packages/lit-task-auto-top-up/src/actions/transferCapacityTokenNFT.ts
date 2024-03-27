import consola from 'consola';

import getConfig from './getConfig';
import getLitContractsInstance from './getLitContracts';
import { toErrorWithMessage } from '../errors';
import TransferCapacityTokenFailure from '../errors/TransferCapacityTokenFailure';
import { TaskResult } from '../types/types';

export default async function transferCapacityTokenNFT({
  capacityTokenIdStr,
  recipientAddress,
}: TaskResult) {
  try {
    const litContracts = await getLitContractsInstance();
    const { NFT_MINTER_ADDRESS } = getConfig();

    consola.log('Transferring capacity token', { capacityTokenIdStr, recipientAddress });

    await litContracts.rateLimitNftContractUtils.write.transfer({
      fromAddress: NFT_MINTER_ADDRESS,
      RLITokenAddress: capacityTokenIdStr,
      toAddress: recipientAddress,
    });
  } catch (e) {
    const err = toErrorWithMessage(e);

    throw new TransferCapacityTokenFailure(
      {
        cause: err,
        info: {
          capacityTokenIdStr,
          recipientAddress,
        },
        name: 'TransferCapacityTokenFailure',
      },
      'Failed to transfer capacity token'
    );
  }
}
