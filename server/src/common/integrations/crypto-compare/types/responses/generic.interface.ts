export interface ICryptoGetawayGenericResponse<TData> {
  Response: 'Success' | 'Error';
  Message: string;
  HasWarning: boolean;
  Type: number;
  RateLimit: Record<string, number>;
  Cooldown?: number;
  Data: TData;
}
