import * as fs from 'node:fs';
import { IBlockchainAccountEnvConfig } from '@common/blockchain/types/env-config';
import { AppConstants } from '../../app.constants';

export const blockchainAccountsConfiguration = (): {
  blockchainAccounts: IBlockchainAccountEnvConfig[];
} => {
  const accountsFilePath = AppConstants.Env.BlockchainAccountsFilePath;
  fs.accessSync(accountsFilePath, fs.constants.R_OK | fs.constants.W_OK);

  const accounts = JSON.parse(
    fs.readFileSync(accountsFilePath, {
      encoding: 'utf8',
    }),
  );

  return { blockchainAccounts: accounts };
};
