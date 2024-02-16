import { IScrollBlockScoutGenericResponse } from './generic.interface';

export interface IScrollBlockScoutCoinPriceData {
  coin_btc: string; // "0.03246",
  coin_btc_timestamp: string; // "1537212510",
  coin_usd: string; // "204",
  coin_usd_timestamp: string; // "1537212513"
}

export type TScrollBlockScoutCoinPriceResponse =
  IScrollBlockScoutGenericResponse<IScrollBlockScoutCoinPriceData>;
