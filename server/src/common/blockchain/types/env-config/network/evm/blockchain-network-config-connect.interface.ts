import { IEvmBlockchainNetworkEnvHttpConnect } from './blockchain-network-http-connect.interface';
import { IEvmBlockchainNetworkEnvWsConnect } from './blockchain-network-ws-connect.interface';

export interface IEvmBlockchainNetworkEnvConfigConnect {
  http: IEvmBlockchainNetworkEnvHttpConnect;
  ws?: IEvmBlockchainNetworkEnvWsConnect;
}