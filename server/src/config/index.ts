import { configuration } from './configuration';
import { usersConfiguration, blockchainNetworksConfiguration } from './json-based';

const configurationLoaders = [configuration, usersConfiguration, blockchainNetworksConfiguration];

export { configurationLoaders };
export { init } from './configuration';
