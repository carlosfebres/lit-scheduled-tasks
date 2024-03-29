/**
 * `getConfig()` returns a singleton instance of the Config class, which is initialized and saved in
 * module-scope when the first time getConfig() is called.
 *
 * To test environment loading, use the Config class directly and pass in env objects as you
 * construct instances of it.
 */
import { ConfigParser } from '../Classes/ConfigParser';

let configInstance: ConfigParser | null = null;

export function getConfig() {
  if (configInstance) {
    return configInstance.config;
  }

  configInstance = new ConfigParser();
  return configInstance.config;
}
