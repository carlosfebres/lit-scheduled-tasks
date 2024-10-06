import { TZDate } from '@date-fns/tz';
import { startOfDay, addDays, subDays, addWeeks, addHours } from 'date-fns';

import { CapacityToken } from '../../src/types/types';

// Note that we consider later today and tomorrow expired even though `isExpired` will be `false` for them
export enum Expired {
  day_before_yesterday = 'day_before_yesterday',
  yesterday = 'yesterday',
}

export enum Unexpired {
  day_after_tomorrow = 'day_after_tomorrow',
  next_week = 'next_week',
  two_weeks_from_now = 'two_weeks_from_now',
}

export enum UnexpiredButInvalid {
  later_today = 'later_today',
  tomorrow = 'tomorrow',
}

interface TokenFixtures {
  expired: Record<Expired, CapacityToken>;
  unexpired: Record<Unexpired, CapacityToken>;
  unexpiredButInvalid: Record<UnexpiredButInvalid, CapacityToken>;
}

export const NOW = new TZDate(1712157737877, 'UTC');
export const MIDNIGHT_TODAY = startOfDay(NOW);
export const YESTERDAY = subDays(MIDNIGHT_TODAY, 1);
export const DAY_BEFORE_YESTERDAY = subDays(MIDNIGHT_TODAY, 2);
export const LATER_TODAY = addHours(NOW, 2);
export const TOMORROW = addDays(MIDNIGHT_TODAY, 1);
export const DAY_AFTER_TOMORROW = addDays(MIDNIGHT_TODAY, 2);
export const NEXT_WEEK = addWeeks(MIDNIGHT_TODAY, 1);
export const TWO_WEEKS_FROM_NOW = addWeeks(MIDNIGHT_TODAY, 2);

// console.log('NOW', NOW.toISOString());
// console.log('MIDNIGHT_TODAY', MIDNIGHT_TODAY.toISOString());
// console.log('DAY_BEFORE_YESTERDAY', DAY_BEFORE_YESTERDAY.toISOString());
// console.log('YESTERDAY', YESTERDAY.toISOString());
// console.log('LATER_TODAY', LATER_TODAY.toISOString());
// console.log('TOMORROW', TOMORROW.toISOString());
// console.log('DAY_AFTER_TOMORROW', DAY_AFTER_TOMORROW.toISOString());
// console.log('NEXT_WEEK', NEXT_WEEK.toISOString());
// console.log('TWO_WEEKS_FROM_NOW', TWO_WEEKS_FROM_NOW.toISOString());

export const tokenFixtures: TokenFixtures = {
  expired: {
    [Expired.day_before_yesterday]: {
      URI: {
        description: 'This is a test token that expired the day before yesterday.',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: DAY_BEFORE_YESTERDAY.toISOString(),
          timestamp: DAY_BEFORE_YESTERDAY.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: true,
      tokenId: 123,
    },
    [Expired.yesterday]: {
      URI: {
        description: 'This is a test token that expired yesterday.',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: YESTERDAY.toISOString(),
          timestamp: YESTERDAY.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: true,
      tokenId: 3214,
    },
  },
  unexpired: {
    [Unexpired.day_after_tomorrow]: {
      URI: {
        description: 'This is a test token that will expire the day after tomorrow',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: DAY_AFTER_TOMORROW.toISOString(),
          timestamp: DAY_AFTER_TOMORROW.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: false,
      tokenId: 264,
    },
    [Unexpired.next_week]: {
      URI: {
        description: 'This is a test token that will expire next week',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: NEXT_WEEK.toISOString(),
          timestamp: NEXT_WEEK.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: false,
      tokenId: 26267,
    },
    [Unexpired.two_weeks_from_now]: {
      URI: {
        description: 'This is a test token that will expire two weeks from now',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: TWO_WEEKS_FROM_NOW.toISOString(),
          timestamp: TWO_WEEKS_FROM_NOW.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: false,
      tokenId: 3597935,
    },
  },
  unexpiredButInvalid: {
    [UnexpiredButInvalid.later_today]: {
      URI: {
        description: 'This is a test token that will expire later today',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: LATER_TODAY.toISOString(),
          timestamp: LATER_TODAY.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: false,
      tokenId: 54762,
    },
    [UnexpiredButInvalid.tomorrow]: {
      URI: {
        description: 'This is a test token that will expire tomorrow.',
        image_data: 'This would be an SVG',
        name: 'Capacity Token',
      },
      capacity: {
        expiresAt: {
          formatted: TOMORROW.toISOString(),
          timestamp: TOMORROW.getTime(),
        },
        requestsPerMillisecond: 50,
      },
      isExpired: false,
      tokenId: 34643,
    },
  },
};
