import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseBlockScoutService } from './base-block-scout.service';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.BaseBlockScout}`)
@ApiTags(`Integrations: "${IntegrationNames.BaseBlockScout}"`)
export class BaseBlockScoutController {
  constructor(private readonly baseBlockScoutService: BaseBlockScoutService) {}
}
