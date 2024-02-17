import { ILineaExplorerGenericResponse } from './generic.interface';

export interface ILineaExplorerTotalFeesData {
  total_fees: string; // "75411956011480008034"
}

export type TLineaExplorerTotalFeesResponse = ILineaExplorerGenericResponse<
  ILineaExplorerTotalFeesData | '0'
>;
