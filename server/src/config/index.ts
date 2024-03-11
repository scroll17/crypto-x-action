import { configuration } from './configuration';
import {
  usersConfiguration,
  blockchainNetworksConfiguration,
  integrationsConfiguration,
  blockchainAccountsConfiguration,
} from './json-based';

const configurationLoaders = [
  configuration,
  usersConfiguration,
  blockchainNetworksConfiguration,
  blockchainAccountsConfiguration,
  integrationsConfiguration,
];

export { configurationLoaders };
export { init } from './configuration';
