import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';

export interface IEvmBlockchainNetworkEnvSocketConnect {
  url: string;
  connectOptions: ClientOptions | ClientRequestArgs;
}
