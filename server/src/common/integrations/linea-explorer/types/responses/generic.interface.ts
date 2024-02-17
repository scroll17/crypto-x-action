export interface ILineaExplorerGenericResponse<TResult> {
  message: 'OK' | string;
  result: TResult;
  status: '0' | '1';
}
