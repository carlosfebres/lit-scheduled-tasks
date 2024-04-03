import { expect } from 'chai';
import { createConsola } from 'consola';

import { tokenFixtures, NOW, Expired, UnexpiredButInvalid, Unexpired } from './tokenFixtures';
import { TaskHandler } from '../../src/index';
import { CapacityToken } from '../../src/types/types';
import { COMPLETE_CONFIG } from '../config';

function getHandlerInstance() {
  return new TaskHandler({
    config: { envConfig: COMPLETE_CONFIG, logger: createConsola() },
  });
}

function testAndAssert({
  expired = [],
  unexpired = [],
  unexpiredButInvalid = [],
}: {
  expired?: CapacityToken[];
  unexpired?: CapacityToken[];
  unexpiredButInvalid?: CapacityToken[];
}) {
  const handlerInstance = getHandlerInstance();
  const { noUsableTokensTomorrow, unexpiredTokens } = handlerInstance.getExistingTokenDetails({
    today: NOW,
    tokens: [...expired, ...unexpired, ...unexpiredButInvalid],
  });

  // Always verify we return the correct expired tokens for logging
  const allUnexpired = [...unexpired, ...unexpiredButInvalid];

  expect(unexpiredTokens).length(allUnexpired.length);
  expect(unexpiredTokens)
    .length(allUnexpired.length)
    .deep.equals(allUnexpired.map(handlerInstance.mapUnexpiredToken));

  if (unexpired.length > 0) {
    expect(noUsableTokensTomorrow).false;
    return false;
  }

  expect(noUsableTokensTomorrow).true;
  return true;
}
describe('Expired Tokens', () => {
  describe('noUsableTokensTomorrow', () => {
    it('should be `true` when there are no tokens at all', () => {
      testAndAssert({});
    });

    it('should be `true` when there are tokens, but they are all already expired', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpired: [],
      });
    });

    it('should be `true` when the only token is not-yet-expired, but will be tomorrow', () => {
      testAndAssert({
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow]],
      });
    });

    it('should be `true` when a mixture of unexpired and expired tokens exist, but the unexpired will be expired tomorrow or later today', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpiredButInvalid: [
          tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.later_today],
          tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow],
        ],
      });
    });

    it('should be `true` when a mixture of unexpired and expired tokens exist, but the unexpired will be expired later today', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.later_today]],
      });
    });

    it('should be `true` when a mixture of unexpired and expired tokens exist, but the unexpired only will be expired tomorrow', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow]],
      });
    });

    it('should be `true` when the only tokens that exist will expire later today', () => {
      testAndAssert({
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.later_today]],
      });
    });

    it('should be `true` when the only tokens that exist will expire tomorrow', () => {
      testAndAssert({
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow]],
      });
    });

    it('should be `false` when the only token that exists expires farther in the future than tomorrow', () => {
      testAndAssert({
        unexpired: [tokenFixtures.unexpired[Unexpired.day_after_tomorrow]],
      });
    });

    it('should be `false` when all tokens that exists expire farther in the future than tomorrow', () => {
      testAndAssert({
        unexpired: [
          tokenFixtures.unexpired[Unexpired.day_after_tomorrow],
          tokenFixtures.unexpired[Unexpired.next_week],
          tokenFixtures.unexpired[Unexpired.two_weeks_from_now],
        ],
      });
    });

    it('should be `false` when some tokens that exist expire farther in the future than tomorrow even when others are expired', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpired: [
          tokenFixtures.unexpired[Unexpired.day_after_tomorrow],
          tokenFixtures.unexpired[Unexpired.next_week],
          tokenFixtures.unexpired[Unexpired.two_weeks_from_now],
        ],
      });
    });

    it('should be `false` when some tokens that exist expire farther in the future than tomorrow even when others are expired and some are unexpired but invalid', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpired: [
          tokenFixtures.unexpired[Unexpired.day_after_tomorrow],
          tokenFixtures.unexpired[Unexpired.next_week],
          tokenFixtures.unexpired[Unexpired.two_weeks_from_now],
        ],
        unexpiredButInvalid: [
          tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow],
          tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.later_today],
        ],
      });
    });

    it('should be `false` when some tokens that exist expire farther in the future than tomorrow even when others are expired and one unexpired will expire later today', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpired: [
          tokenFixtures.unexpired[Unexpired.day_after_tomorrow],
          tokenFixtures.unexpired[Unexpired.next_week],
          tokenFixtures.unexpired[Unexpired.two_weeks_from_now],
        ],
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.later_today]],
      });
    });

    it('should be `false` when some tokens that exist expire farther in the future than tomorrow even when others are expired and one unexpired will expire tomorrow', () => {
      testAndAssert({
        expired: [
          tokenFixtures.expired[Expired.yesterday],
          tokenFixtures.expired[Expired.day_before_yesterday],
        ],
        unexpired: [
          tokenFixtures.unexpired[Unexpired.day_after_tomorrow],
          tokenFixtures.unexpired[Unexpired.next_week],
          tokenFixtures.unexpired[Unexpired.two_weeks_from_now],
        ],
        unexpiredButInvalid: [tokenFixtures.unexpiredButInvalid[UnexpiredButInvalid.tomorrow]],
      });
    });
  });
});
