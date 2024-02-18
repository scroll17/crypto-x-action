export interface IZkSyncBlockExplorerGenericResponse<TResult> {
  message: 'OK' | string;
  result: TResult;
  status: '0' | '1';
}
