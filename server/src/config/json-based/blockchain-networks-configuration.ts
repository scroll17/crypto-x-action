import * as fs from 'node:fs';
import { IBlockchainNetworkEnvConfig } from '@common/blockchain/types/env-config';
import { AppConstants } from '../../app.constants';

export const blockchainNetworksConfiguration = (): {
  blockchainNetworks: Record<string, IBlockchainNetworkEnvConfig>;
} => {
  const networksFilePath = AppConstants.Env.BlockchainNetworksFilePath;
  fs.accessSync(networksFilePath, fs.constants.R_OK | fs.constants.W_OK);

  const networks = JSON.parse(
    fs.readFileSync(networksFilePath, {
      encoding: 'utf8',
    }),
  );

  return { blockchainNetworks: networks };
};
