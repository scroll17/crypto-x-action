import { ICryptoGetawayGenericResponse } from '@common/integrations/crypto-compare/types/responses/generic.interface';

export interface ICryptoGetawayRateLimitData {
  calls_made: {
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
  };
  calls_left: {
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
  };
}

export type TCryptoGetawayRateLimitResponse = ICryptoGetawayGenericResponse<ICryptoGetawayRateLimitData>;
