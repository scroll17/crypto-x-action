// TODO: BlockchainExplorer
export interface ITransactionsStat {
  txCount: number;
  txDayMap: Array<[string, string]>;
  firstTxDate: Date | null;
  lastTxDate: Date | null;
  unique: {
    days: string[];
    weeks: string[];
    months: string[];
    contracts: string[];
  };
  deployedContracts: string[];
  total: {
    fee: string;
    USDFee: number;
    volume: string;
    USDVolume: number;
    gasUsed: string;
    gasPrice: string;
    USDGasPrice: number;
  };
}
