import * as path from 'node:path';
import { BlockchainNetworkName } from '@common/blockchain/enums';
import { IntegrationNames } from '@common/integrations/common';
import { TransactionReportColumnEntity } from './modules/wallet-inspector/entities';

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
    export const WALLET_CHECKER_INTEGRATIONS: Record<BlockchainNetworkName, IntegrationNames | null> = {
      [BlockchainNetworkName.Ethereum]: null,
      [BlockchainNetworkName.Base]: IntegrationNames.BaseBlockScout,
      [BlockchainNetworkName.Scroll]: IntegrationNames.ScrollBlockScout,
      [BlockchainNetworkName.Linea]: IntegrationNames.LineaExplorer,
      [BlockchainNetworkName.ZkSync]: IntegrationNames.ZkSyncBlockExplorer,
    };

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

  export namespace WalletInspector {
    export const TRANSACTIONS_REPORT_COLUMNS_MAP: TransactionReportColumnEntity[] = [
      {
        index: 1,
        fieldName: 'address',
        columnName: 'Address',
        focusName: 'Blockchain Address',
      },
      {
        index: 2,
        fieldName: 'eth',
        columnName: 'ETH',
        focusName: 'Total ETH Balance',
      },
      {
        index: 3,
        fieldName: 'txCount',
        columnName: 'TX count',
        focusName: 'Transactions count',
      },
      {
        index: 4,
        fieldName: 'volume',
        columnName: 'Volume',
        focusName: 'Total Transactions volume',
      },
      {
        index: 5,
        fieldName: 'gasUsed',
        columnName: 'Gas used',
        focusName: 'Total Transactions gas used',
      },
      {
        index: 6,
        fieldName: 'dContracts',
        columnName: 'D Contracts',
        focusName: 'Deployed Contracts',
      },
      {
        index: 7,
        fieldName: 'uContracts',
        columnName: 'U Contracts',
        focusName: 'Unique Contracts',
      },
      {
        index: 8,
        fieldName: 'uDays',
        columnName: 'U Days',
        focusName: 'Unique Days',
      },
      {
        index: 9,
        fieldName: 'uWeeks',
        columnName: 'U Weeks',
        focusName: 'Unique Weeks',
      },
      {
        index: 10,
        fieldName: 'uMonths',
        columnName: 'U Months',
        focusName: 'Unique Months',
      },
      {
        index: 11,
        fieldName: 'firstTxDate',
        columnName: 'First TX Day',
        focusName: 'Day of first Transaction',
      },
      {
        index: 12,
        fieldName: 'lastTxDate',
        columnName: 'Last TX Day',
        focusName: 'Day of last Transaction',
      },
      {
        index: 13,
        fieldName: 'fee',
        columnName: 'Fee',
        focusName: 'Total Transactions fee',
      },
      {
        index: 14,
        fieldName: 'gasPrice',
        columnName: 'Gas price',
        focusName: 'Total Transactions fas price',
      },
    ];
  }
}
