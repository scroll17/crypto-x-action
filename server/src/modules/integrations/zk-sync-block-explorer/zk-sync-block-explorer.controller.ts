import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZkSyncBlockExplorerService } from './zk-sync-block-explorer.service';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.ZkSyncBlockExplorer}`)
@ApiTags(`Integrations: "${IntegrationNames.ZkSyncBlockExplorer}"`)
export class ZkSyncBlockExplorerController {
  constructor(private readonly zkSyncBlockExplorerService: ZkSyncBlockExplorerService) {}
}
