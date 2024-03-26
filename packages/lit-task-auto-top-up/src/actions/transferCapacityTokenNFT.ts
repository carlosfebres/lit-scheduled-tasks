import getConfigSingleton from '../config/getConfigSingleton';
import { toErrorWithMessage } from '../errors';
import TransferCapacityTokenFailure from '../errors/TransferCapacityTokenFailure';
import getLitContractsInstance from '../getLitContractsInstanceSingleton';
import { TaskResult } from '../types/types';

export default async function transferCapacityTokenNFT({ capacityTokenIdStr, recipientAddress }: TaskResult) {
  try {
    const litContracts = getLitContractsInstance();
    const { FAUCET_ADDRESS } = getConfigSingleton();

    await litContracts.rateLimitNftContractUtils.write.transfer({
      fromAddress: FAUCET_ADDRESS,
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
