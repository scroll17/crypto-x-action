import * as path from 'node:path';
import { IntegrationNames } from '@common/integrations/common';

export namespace AppConstants {
  export namespace Env {
    export const EnvFolderPath = path.resolve(__dirname, '../env');

    export const UsersFileName = '.users.json';
    export const UsersFilePath = path.resolve(EnvFolderPath, UsersFileName);

    export const BlockchainNetworksFileName = '.blockchain-networks.json';
    export const BlockchainNetworksFilePath = path.resolve(EnvFolderPath, BlockchainNetworksFileName);

    export const IntegrationsFileName = '.integrations.json';
    export const IntegrationsFilePath = path.resolve(EnvFolderPath, IntegrationsFileName);
  }
}
