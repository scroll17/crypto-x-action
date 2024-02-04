export interface IBaseBlockScoutWalletAddressData {
  block_number_balance_updated_at: number;
  coin_balance: string; // "41497482860285" - wei
  creation_tx_hash: null;
  creator_address_hash: null;
  ens_domain_name: null;
  exchange_rate: string; // "2312.75"
  has_beacon_chain_withdrawals: boolean;
  has_custom_methods_read: boolean;
  has_custom_methods_write: boolean;
  has_decompiled_code: boolean;
  has_logs: boolean;
  has_methods_read: boolean;
  has_methods_read_proxy: boolean;
  has_methods_write: boolean;
  has_methods_write_proxy: boolean;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: boolean;
  hash: string; // "0xcdad2088693213eaa880F2b221c3c8e881655f27" - address
  implementation_address: null;
  implementation_name: null;
  is_contract: boolean;
  is_verified: null;
  name: null;
  private_tags: [];
  public_tags: [];
  token: null;
  watchlist_address_id: null;
  watchlist_names: [];
}

export interface IBaseBlockScoutContractAddressData {}

export type TBaseBlockScoutAddressResponse = IBaseBlockScoutWalletAddressData;
