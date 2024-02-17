import * as path from 'node:path';

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

  export namespace Integration {
    export namespace Scroll {
      export const COIN_CONTRACTS = {
        USDC: {
          token: 'USDC',
          address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
          decimals: 6,
        },
        USDT: {
          token: 'USDT',
          address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
          decimals: 6,
        },
        DAI: {
          token: 'DAI',
          address: '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97',
          decimals: 18,
        },
      } as const;
    }
  }
}
