import { IZkSyncBlockExplorerGenericResponse } from './generic.interface';

export interface IZkSyncBlockExplorerEthPriceData {
  ethusd: string; // "1823.567",
  ethusd_timestamp: string; // "1624961308"
}

export type TZkSyncBlockExplorerEthPriceResponse =
  IZkSyncBlockExplorerGenericResponse<IZkSyncBlockExplorerEthPriceData>;
