import * as path from 'node:path';

export namespace AppConstants {
  export namespace Env {
    export const EnvFolderPath = path.resolve(__dirname, '../env');

    export const UsersFileName = '.users.json';
    export const UsersFilePath = path.resolve(EnvFolderPath, UsersFileName);

    export const BlockchainNetworksFileName = '.blockchain-networks.json';
    export const BlockchainNetworksFilePath = path.resolve(EnvFolderPath, BlockchainNetworksFileName);
  }
}
