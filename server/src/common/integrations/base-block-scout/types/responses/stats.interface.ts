export interface IBaseBlockScoutStatsData {
  average_block_time: number;
  coin_price: string; // '2317.65'
  coin_price_change_percentage: number;
  gas_price_updated_at: string; // '2024-02-03T20:24:43.762575Z'
  gas_prices: {
    average: number;
    fast: number;
    slow: number;
  };
  gas_prices_update_in: number;
  gas_used_today: string; // '81135128548'
  market_cap: string; // '0.000'
  network_utilization_percentage: number; // 12.0376076
  static_gas_price: null;
  total_addresses: string; // '65287842'
  total_blocks: string; // '10101138'
  total_gas_used: string; // '0'
  total_transactions: string; // '93234378'
  transactions_today: string; // '403670'
  tvl: null;
}

export type TBaseBlockScoutStatsResponse = IBaseBlockScoutStatsData;
