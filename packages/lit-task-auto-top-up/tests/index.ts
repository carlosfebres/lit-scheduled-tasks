import { expect } from 'chai';

import Config from '../src/Classes/Config';
import { DEFAULT_RECIPIENT_LIST_URL } from '../src/constants';

const NFT_MINTER_ADDRESS = '123456789012345678901234567890123';
const NFT_MINTER_KEY = '123456789012345678901234567890123';

const VALID_CONFIG = { NFT_MINTER_ADDRESS, NFT_MINTER_KEY };
describe('Configuration', () => {
  describe('Required properties', () => {
    it('should require minter PK and faucet address to be provided', () => {
      expect(() => new Config({ NFT_MINTER_ADDRESS, NFT_MINTER_KEY })).not.throw();
      expect(() => new Config({})).throw();
    });
  });

  describe('RECIPIENT_LIST_URL', () => {
    it('should treat recipient list URL as optional', () => {
      expect(() => new Config(VALID_CONFIG)).not.throw();
    });

    it('should provide our default source URL when not defined in env', () => {
      const { config } = new Config(VALID_CONFIG);
      expect(config).property('RECIPIENT_LIST_URL', DEFAULT_RECIPIENT_LIST_URL);
    });
  });
});
