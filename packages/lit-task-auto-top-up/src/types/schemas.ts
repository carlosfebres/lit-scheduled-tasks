import { z } from 'zod';

import { DEFAULT_RECIPIENT_LIST_URL } from '../constants';

export const recipientDetailSchema = z
  .object({
    daysUntilExpires: z.number().default(10),
    recipientAddress: z.string(),
    requestsPerSecond: z.number().default(10),
  })
  .required();
export const recipientDetailsListSchema = z.array(recipientDetailSchema);
export const requiredConfigSchema = {
  NFT_MINTER_ADDRESS: z.string().min(32),
  NFT_MINTER_KEY: z.string().min(32),
};
export const optionalConfigSchema = {
  RECIPIENT_LIST_URL: z.string().default(DEFAULT_RECIPIENT_LIST_URL),
};
export const envConfigSchema = z.intersection(
  z.object(requiredConfigSchema).required(),
  z.object(optionalConfigSchema)
);
