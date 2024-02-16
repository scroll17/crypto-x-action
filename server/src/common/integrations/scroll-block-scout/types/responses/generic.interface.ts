export interface IScrollBlockScoutGenericResponse<TResult> {
  message: 'OK';
  result: TResult;
  status: '0' | '1';
}
