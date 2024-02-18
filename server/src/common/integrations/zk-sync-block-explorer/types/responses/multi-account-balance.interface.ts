import { IZkSyncBlockExplorerGenericResponse } from './generic.interface';

export interface IZkSyncBlockExplorerMultiAccountBalanceData {
  account: string; // "0x1480ceda0426d7263214dd1cdde148803919d846",
  balance: string; // "60082825507761",
}

export type TZkSyncBlockExplorerMultiAccountBalanceResponse = IZkSyncBlockExplorerGenericResponse<
  IZkSyncBlockExplorerMultiAccountBalanceData[]
>;
