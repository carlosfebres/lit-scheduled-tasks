import { toErrorWithMessage } from '../errors';
import { getConfig } from '../singletons/getConfig';
import { getLitContractsInstance } from '../singletons/getLitContracts';
import { RecipientDetail } from '../types/types';

export async function pruneExpiredCapacityTokenNFT({
  recipientDetail,
}: {
  recipientDetail: RecipientDetail;
}) {
  const litContracts = await getLitContractsInstance();
  const { logger } = getConfig();

  const { recipientAddress } = recipientDetail;

  try {
    logger.log('Pruning expired capacity token NFTs for', recipientDetail);

    const { actualTokensBurned, txHash } =
      await litContracts.rateLimitNftContractUtils.write.pruneExpired(recipientAddress);

    logger.log('Pruned capacity token NFTs for', recipientAddress, { actualTokensBurned, txHash });
  } catch (e) {
    const err = toErrorWithMessage(e);

    logger.error('Failed to prune capacity tokens', err.toString(), 'for', recipientAddress, '...');
  }
}
