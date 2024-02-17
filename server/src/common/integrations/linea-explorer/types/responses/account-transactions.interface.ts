import { ILineaExplorerGenericResponse } from './generic.interface';

export interface ILineaExplorerAccountTransactionsData {
  blockHash: string; // "0x373d339e45a701447367d7b9c7cef84aab79c2b2714271b908cda0ab3ad0849b",
  blockNumber: string; // "65204",
  confirmations: string; // "5994246",
  contractAddress: string; // "",
  cumulativeGasUsed: string; // "122207",
  from: string; // "0x3fb1cd2cd96c6d5c0b5eb3322d807b34482481d4",
  gas: string; // "122261",
  gasPrice: string; // "50000000000",
  gasUsed: string; // "122207",
  hash: string; // "0x98beb27135aa0a25650557005ad962919d6a278c4b3dde7f4f6a3a1e65aa746c",
  input: string; // "0xf00d4b5d000000000000000000000000036c8cecce8d8bbf0831d840d7f29c9e3ddefa63000000000000000000000000c5a96db085dda36ffbe390f455315d30d6d3dc52",
  isError: '0' | '1';
  nonce: string; // "0",
  timeStamp: string; // "1439232889",
  to: string; // "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
  transactionIndex: string; // "0",
  txreceipt_status: '0' | '1';
  value: string; // "0"
}

export type TLineaExplorerAccountTransactionsResponse = ILineaExplorerGenericResponse<
  ILineaExplorerAccountTransactionsData[]
>;
