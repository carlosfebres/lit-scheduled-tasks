import { toErrorWithMessage } from '../errors';
import MintCapacityTokenFailure from '../errors/MintCapacityTokenFailure';
import getLitContractsInstance from '../getLitContractsInstanceSingleton';

export default async function mintCapacityCreditNFT({ recipientAddress }: { recipientAddress: string }) {
  const litContracts = getLitContractsInstance();

  try {
    const { capacityTokenIdStr } = await litContracts.mintCapacityCreditsNFT({
      daysUntilUTCMidnightExpiration: 1,
      requestsPerDay: 1000,
      requestsPerKilosecond: 10,
      requestsPerSecond: 10,
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
