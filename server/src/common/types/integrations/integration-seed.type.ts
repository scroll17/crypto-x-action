import { Integration } from '@schemas/integration';

export type TIntegrationSeed = Pick<Integration, 'key' | 'name' | 'apiUrl' | 'description' | 'active'>;
