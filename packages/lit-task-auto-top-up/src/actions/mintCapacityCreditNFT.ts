import { toErrorWithMessage } from '../errors';
import { MintCapacityTokenFailure } from '../errors/MintCapacityTokenFailure';
import { getConfig } from '../singletons/getConfig';
import { getLitContractsInstance } from '../singletons/getLitContracts';
import { RecipientDetail } from '../types/types';

export async function mintCapacityCreditNFT({
  recipientDetail,
}: {
  recipientDetail: RecipientDetail;
}) {
  const litContracts = await getLitContractsInstance();
  const { logger } = getConfig();

  const { daysUntilExpires, recipientAddress, requestsPerSecond } = recipientDetail;

  try {
    logger.log('Minting capacity token', recipientDetail);

    const { capacityTokenIdStr } = await litContracts.mintCapacityCreditsNFT({
      requestsPerSecond,
      daysUntilUTCMidnightExpiration: daysUntilExpires,
    });

    return capacityTokenIdStr;
  } catch (e) {
    const err = toErrorWithMessage(e);

    throw new MintCapacityTokenFailure(
      {
        cause: err,
        info: {
          recipientAddress,
          requestsPerSecond,
          daysUntilUTCMidnightExpiration: daysUntilExpires,
        },
        name: 'MintCapacityTokenFailure',
      },
      'Failed to mint capacity token'
    );
  }
}
