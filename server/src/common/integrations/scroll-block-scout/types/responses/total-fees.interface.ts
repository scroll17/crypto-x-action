import { IScrollBlockScoutGenericResponse } from './generic.interface';

export interface IScrollBlockScoutTotalFeesData {
  total_fees: string; // "75411956011480008034"
}

export type TScrollBlockScoutTotalFeesResponse = IScrollBlockScoutGenericResponse<
  IScrollBlockScoutTotalFeesData | '0'
>;
