import { configuration } from './configuration';
import { usersConfiguration, blockchainNetworksConfiguration, integrationsConfiguration } from './json-based';

const configurationLoaders = [
  configuration,
  usersConfiguration,
  blockchainNetworksConfiguration,
  integrationsConfiguration,
];

export { configurationLoaders };
export { init } from './configuration';
