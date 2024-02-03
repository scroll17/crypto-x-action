export interface IBaseBlockScoutStatsData {
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

export type TBaseBlockScoutStatsResponse = IBaseBlockScoutStatsData;
