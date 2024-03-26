/**
 * `getConfig`returns singleton instance of the Config class, which is initialized at module-scope
 * when this module is loaded. WARNING: Loading this module may cause an immediate exception, as it
 * parses`process.env` as it is parsed; missing required env keys result in the constructor
 * throwing
 *
 * To test environment loading, use the Config class directly and pass in env objects as you
 * construct instances of it.
 */
import Config from '../Classes/Config';

const configInstance = new Config();

export default function getConfig() {
  return configInstance.config;
}
