import getLitContractsInstance from './getLitContracts';
import { toErrorWithMessage } from '../errors';
import MintCapacityTokenFailure from '../errors/MintCapacityTokenFailure';
import { RecipientDetail } from '../types/types';

export default async function mintCapacityCreditNFT({
  recipientDetail,
}: {
  recipientDetail: RecipientDetail;
}) {
  const litContracts = getLitContractsInstance();

  const {
    daysUntilExpires,
    recipientAddress,
    requestsPerDay,
    requestsPerKilosecond,
    requestsPerSecond,
  } = recipientDetail;

  try {
    const { capacityTokenIdStr } = await litContracts.mintCapacityCreditsNFT({
      requestsPerDay,
      requestsPerKilosecond,
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
        },
        name: 'MintCapacityTokenFailure',
      },
      'Failed to mint capacity token'
    );
  }
}
