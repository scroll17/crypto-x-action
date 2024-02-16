import { IScrollBlockScoutGenericResponse } from './generic.interface';

export interface IScrollBlockScoutTotalMultiAccountBalanceData {
  account: string; // "0x1480ceda0426d7263214dd1cdde148803919d846",
  balance: string; // "60082825507761",
  stale: boolean;
  /**
   *  If the balance hasn't been updated in a long time,
   *  we will double check with the node to fetch the absolute latest balance
   * */
}

export type TScrollBlockScoutMultiAccountBalanceResponse = IScrollBlockScoutGenericResponse<
  IScrollBlockScoutTotalMultiAccountBalanceData[]
>;
