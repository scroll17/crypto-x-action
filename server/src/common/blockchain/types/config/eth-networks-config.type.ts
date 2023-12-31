import { HttpProviderOptions } from 'web3-providers-http';
import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';
import { BlockchainNetworks, BlockchainNetworkType } from '@common/blockchain/enums';

export type TEthBlockchainNetworksConfig = Record<
  BlockchainNetworks.Ethereum | BlockchainNetworks.StarkNet,
  {
    networkType: BlockchainNetworkType;
    networkName: string;
    http?: {
      url: string;
      connectOptions: HttpProviderOptions['providerOptions'];
    };
    ws?: {
      url: string;
      connectOptions: ClientOptions | ClientRequestArgs;
    };
  }
>;
