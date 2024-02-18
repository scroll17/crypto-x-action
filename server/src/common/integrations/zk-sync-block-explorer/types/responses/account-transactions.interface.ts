import { IZkSyncBlockExplorerGenericResponse } from './generic.interface';

export interface IZkSyncBlockExplorerAccountTransactionsData {
  hash: string; // "0x5e018d2a81dbd1ef80ff45171dd241cb10670dcb091e324401ff8f52293841b0",
  to: string; // "0xc7e0220d02d549c4846A6EC31D89C3B670Ebe35C",
  from: string; // "0xc7e0220d02d549c4846A6EC31D89C3B670Ebe35C",
  transactionIndex: string; // "3233097",
  input: string; // "0x000000000000000000000000000000000000000000000000016345785d8a0000",
  value: string; // "10000000000000000",
  gas: string; // "122261",
  gasPrice: string; // "50000000000",
  gasUsed: string; // "122207",
  cumulativeGasUsed: string; // "10000000000000000",
  fee: string; // "10000000000000000",
  nonce: string; // "42",
  confirmations: string; // "100",
  blockNumber: string; // "3233097",
  blockHash: string; // 0xdfd071dcb9c802f7d11551f4769ca67842041ffb81090c49af7f089c5823f39c",
  timeStamp: string; // "1679988122",
  commitTxHash: string; // "0xdfd071dcb9c802f7d11551f4769ca67842041ffb81090c49af7f089c5823f39c",
  proveTxHash: string; // "0xdfd071dcb9c802f7d11551f4769ca67842041ffb81090c49af7f089c5823f39c",
  executeTxHash: string; // "0xdfd071dcb9c802f7d11551f4769ca67842041ffb81090c49af7f089c5823f39c",
  isL1Originated: string; // "1",
  l1BatchNumber: string; // "3233097",
  contractAddress: string; // "0x8A63F953e19aA4Ce3ED90621EeF61E17A95c6594",
  isError: '0' | '1';
  txreceipt_status: '0' | '1';
  methodId: string; // "0xa9059cbb",
  functionName: string; // "transfer(address to, uint256 tokens)",
  type: string; // "255"
}

export type TZkSyncBlockExplorerAccountTransactionsResponse = IZkSyncBlockExplorerGenericResponse<
  IZkSyncBlockExplorerAccountTransactionsData[]
>;
