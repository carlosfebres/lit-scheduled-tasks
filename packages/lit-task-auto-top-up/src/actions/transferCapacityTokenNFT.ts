import getConfig from './getConfig';
import getLitContractsInstance from './getLitContracts';
import { toErrorWithMessage } from '../errors';
import TransferCapacityTokenFailure from '../errors/TransferCapacityTokenFailure';

export default async function transferCapacityTokenNFT({
  capacityTokenIdStr,
  recipientAddress,
}: {
  capacityTokenIdStr: string;
  recipientAddress: string;
}) {
  try {
    const litContracts = await getLitContractsInstance();
    const {
      envConfig: { NFT_MINTER_ADDRESS },
      logger,
    } = getConfig();

    logger.log('Transferring capacity token', { capacityTokenIdStr, recipientAddress });

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
