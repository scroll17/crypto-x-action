import { BlockchainNetworkFamily } from '@common/blockchain';
import { IBlockchainNetworkEnvConfigDetails } from './blockchain-network-config-details.interface';
import { IEvmBlockchainNetworkEnvConfigConnect } from '@common/blockchain/types/env-config/network/evm';

export interface IBlockchainNetworkEnvConfig {
  family: BlockchainNetworkFamily; // EVM, StarkNet, ...
  localName: string;
  description: string;
  details: IBlockchainNetworkEnvConfigDetails;
  connect: IEvmBlockchainNetworkEnvConfigConnect;
}
