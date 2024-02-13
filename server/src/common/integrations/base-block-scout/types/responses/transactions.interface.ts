/**
 * {
 *   timestamp: '2024-01-24T14:16:53.000000Z',
 *   fee: { type: 'actual', value: '26631914706628' },
 *   gas_limit: '21000',
 *   l1_gas_price: '19010128881',
 *   block: 9658233,
 *   status: 'ok',
 *   method: null,
 *   confirmations: 785859,
 *   type: 2,
 *   l1_fee_scalar: '0.684',
 *   exchange_rate: '2508.08',
 *   to: {
 *     ens_domain_name: null,
 *     hash: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
 *     implementation_name: null,
 *     is_contract: false,
 *     is_verified: false,
 *     name: null,
 *     private_tags: [],
 *     public_tags: [],
 *     watchlist_names: []
 *   },
 *   tx_burnt_fee: '6384000',
 *   max_fee_per_gas: '91422',
 *   result: 'success',
 *   hash: '0x1f525569c586e11f17267aee5e318b1893584abdee2462c270032d03562186d9',
 *   gas_price: '91326',
 *   priority_fee: '1911462000',
 *   base_fee_per_gas: '304',
 *   from: {
 *     ens_domain_name: null,
 *     hash: '0x1480ceDa0426d7263214dD1cddE148803919d846',
 *     implementation_name: null,
 *     is_contract: false,
 *     is_verified: false,
 *     name: null,
 *     private_tags: [],
 *     public_tags: [],
 *     watchlist_names: []
 *   },
 *   token_transfers: null,
 *   tx_types: [ 'coin_transfer' ],
 *   l1_gas_used: '2048',
 *   gas_used: '21000',
 *   created_contract: null,
 *   position: 8,
 *   nonce: 17,
 *   has_error_in_internal_txs: false,
 *   actions: [],
 *   l1_fee: '26629996860628',
 *   decoded_input: null,
 *   token_transfers_overflow: null,
 *   raw_input: '0x',
 *   value: '427832000000009019',
 *   max_priority_fee_per_gas: '91022',
 *   revert_reason: null,
 *   confirmation_duration: [ 0, 2000 ],
 *   tx_tag: null
 * }
 * */

export interface IBaseBlockScoutTransactionFee {
  type: 'maximum' | 'actual';
  value: string; // "9853224000000000"
}

export interface IBaseBlockScoutTransactionSender {
  ens_domain_name: null;
  hash: string; // "0xEb533ee5687044E622C69c58B1B12329F56eD9ad"
  implementation_name: string | null;
  name: string | null;
  is_contract: boolean;
  is_verified: boolean;
  private_tags: Array<Record<string, unknown>>;
  watchlist_names: Array<Record<string, unknown>>;
  public_tags: Array<Record<string, unknown>>;
}

export interface IBaseBlockScoutTransaction {
  timestamp: string; // "2022-08-02T07:18:05.000000Z"
  fee: IBaseBlockScoutTransactionFee;
  gas_limit: string; // '21000'
  l1_gas_price: string; // '19010128881'
  l1_fee_scalar: string; // '0.684'
  l1_gas_used: string; // '2048'
  l1_fee: string; // '26629996860628'
  gas_used: string; // '21000'
  gas_price: string; // "26668595172"
  priority_fee: string; //  "2056916056308"
  max_fee_per_gas: string; // "55357460102"
  base_fee_per_gas: string; // "26618801760"
  max_priority_fee_per_gas: string; // "49793412"
  tx_burnt_fee: string; // "1099596081903840"
  block: number;
  status: 'ok' | 'error';
  method: string | null;
  confirmations: number;
  type: number;
  exchange_rate: string; // '2508.08'
  to: IBaseBlockScoutTransactionSender;
  result: 'success' | string; // "Error: (Awaiting internal transactions for reason)"
  hash: string; // "0x5d90a9da2b8da402b11bc92c8011ec8a62a2d59da5c7ac4ae0f73ec51bb73368"
  from: IBaseBlockScoutTransactionSender;
  token_transfers: Array<Record<string, unknown>> | null;
  tx_types: Array<
    'token_transfer' | 'contract_creation' | 'contract_call' | 'token_creation' | 'coin_transfer'
  >;
  created_contract: Record<string, unknown> | null;
  position: number;
  nonce: number;
  has_error_in_internal_txs: boolean;
  actions: Array<Record<string, unknown>>;
  decoded_input: Record<string, unknown> | null;
  token_transfers_overflow: boolean;
  raw_input: string;
  value: string; //  "0" | "427832000000009019"
  revert_reason: string | null; // "Error: (Awaiting internal transactions for reason)"
  confirmation_duration: [number, number]; // [ 0, 2000 ]
  tx_tag: string | null;
}

export interface IBaseBlockScoutTransactionsPaginate {
  block_number: number;
  index: number;
  items_count: number;
}

export type TBaseBlockScoutTransactionsResponse = {
  items: IBaseBlockScoutTransaction[];
  next_page_params: IBaseBlockScoutTransactionsPaginate;
};
