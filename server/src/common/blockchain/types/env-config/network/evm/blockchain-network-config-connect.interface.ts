import { IEvmBlockchainNetworkEnvHttpConnect } from './blockchain-network-http-connect.interface';
import { IEvmBlockchainNetworkEnvSocketConnect } from './blockchain-network-socket-connect.interface';

export interface IEvmBlockchainNetworkEnvConfigConnect {
  http: IEvmBlockchainNetworkEnvHttpConnect;
  socket?: IEvmBlockchainNetworkEnvSocketConnect;
}
