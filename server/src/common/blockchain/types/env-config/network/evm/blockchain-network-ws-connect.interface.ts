import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';

export interface IEvmBlockchainNetworkEnvWsConnect {
  url: string;
  connectOptions: ClientOptions | ClientRequestArgs;
}
