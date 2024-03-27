import { expect } from 'chai';
import _ from 'lodash';

import ConfigParser from '../src/Classes/ConfigParser';
import { DEFAULT_RECIPIENT_LIST_URL } from '../src/constants';
import { EnvConfig } from '../src/types/types';

const NFT_MINTER_ADDRESS = '123456789012345678901234567890123';
const NFT_MINTER_KEY = '123456789012345678901234567890123';
const LIT_NETWORK = 'manzano';
const RECIPIENT_LIST_URL = 'https://example.com/json/file.json';

const COMPLETE_CONFIG: EnvConfig = {
  LIT_NETWORK,
  NFT_MINTER_ADDRESS,
  NFT_MINTER_KEY,
  RECIPIENT_LIST_URL,
};
describe('Configuration', () => {
  describe('Required properties', () => {
    it('should require minter PK and faucet address to be provided', () => {
      expect(() => new ConfigParser({ NFT_MINTER_ADDRESS, NFT_MINTER_KEY })).not.throw();
      expect(() => new ConfigParser({})).throw();
    });

    it('should require at least minter PK and faucet address to be provided', () => {
      expect(
        () => new ConfigParser(_.pick(COMPLETE_CONFIG, ['NFT_MINTER_ADDRESS', 'NFT_MINTER_KEY']))
      ).not.throw();
    });

    it('should fail if minter address is missing', () => {
      expect(() => new ConfigParser(_.omit(COMPLETE_CONFIG, ['NFT_MINTER_ADDRESS']))).throw();
    });

    it('should fail if minter key is missing', () => {
      expect(() => new ConfigParser(_.pick(COMPLETE_CONFIG, ['NFT_MINTER_KEY']))).throw();
    });
  });

  describe('RECIPIENT_LIST_URL', () => {
    it('should treat recipient list URL as optional', () => {
      expect(() => new ConfigParser(_.omit(COMPLETE_CONFIG, ['RECIPIENT_LIST_URL']))).not.throw();
    });

    it('should provide our default source URL when not defined in env', () => {
      const { config } = new ConfigParser(_.omit(COMPLETE_CONFIG, ['RECIPIENT_LIST_URL']));
      expect(config).property('RECIPIENT_LIST_URL', DEFAULT_RECIPIENT_LIST_URL);
    });
  });
});
