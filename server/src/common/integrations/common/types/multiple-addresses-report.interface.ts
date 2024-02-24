import { IBlockchainExplorerAddressReport } from '@common/integrations/common';

type TETHtoUSDPrice = [number, number];

export interface IBlockchainExplorerMultipleAddressesReport {
  reports: IBlockchainExplorerAddressReport[];
  totalEth: TETHtoUSDPrice;
  totalVolume: TETHtoUSDPrice;
  totalFee: TETHtoUSDPrice;
  totalGasPrice: TETHtoUSDPrice;
}
