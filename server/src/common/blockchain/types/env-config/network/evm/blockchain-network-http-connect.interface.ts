import { HttpProviderOptions } from 'web3-providers-http/lib/types';

export interface IEvmBlockchainNetworkEnvHttpConnect {
  url: string;
  connectOptions: HttpProviderOptions['providerOptions'];
}
