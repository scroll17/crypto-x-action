type TETHtoUSDPrice = [string, number];

export interface IBlockchainExplorerAddressReport {
  address: string;
  eth: TETHtoUSDPrice;
  txCount: number;
  volume: TETHtoUSDPrice;
  gasUsed: string;
  dContracts: number;
  uContracts: number;
  uDays: number;
  uWeeks: number;
  uMonths: number;
  firstTxDate: Date | null;
  lastTxDate: Date | null;
  totalFee: TETHtoUSDPrice;
  totalGasPrice: TETHtoUSDPrice;
}
