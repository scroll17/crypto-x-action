import { BlockchainNetworkName, BlockchainNetworkPrototypeLevel } from '@common/blockchain/enums';

export interface IBlockchainNetworkEnvConfigDetails {
  name: BlockchainNetworkName; // Ethereum, ZkSync, ...
  prototypeLevel: BlockchainNetworkPrototypeLevel; // mainnet, testnet
  currencySymbol: string;
  networkId: number | null;
  scan: string | null;
}
