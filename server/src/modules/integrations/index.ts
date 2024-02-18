import { CryptoCompareModule } from './crypto-compare/crypto-compare.module';
import { BaseBlockScoutModule } from './base-block-scout/base-block-scout.module';
import { ScrollBlockScoutModule } from './scroll-block-scout/scroll-block-scout.module';
import { LineaExplorerModule } from './linea-explorer/linea-explorer.module';
import { ZkSyncBlockExplorerModule } from './zk-sync-block-explorer/zk-sync-block-explorer.module';

export const INTEGRATION_MODULES = [
  CryptoCompareModule,
  BaseBlockScoutModule,
  ScrollBlockScoutModule,
  LineaExplorerModule,
  ZkSyncBlockExplorerModule,
];
