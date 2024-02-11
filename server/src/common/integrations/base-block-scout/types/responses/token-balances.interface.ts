export interface IBaseBlockScoutTokenBalancesData {
  token_instance: Record<string, unknown>;
  value: string; // "10000"
  token_id: string; // "123"
  token: {
    name: string; // "Tether USD"
    decimals: string; // "16"
    symbol: string; // "USDT"
    address: string; // "0x394c399dbA25B99Ab7708EdB505d755B3aa29997"
    type: string; // "ERC-20"
    holders: number;
    exchange_rate: string; // "0.99"
    total_supply: string; // "10000000"
  };
}

export type TBaseBlockScoutTokenBalancesResponse = IBaseBlockScoutTokenBalancesData;
