import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScrollBlockScoutService } from './scroll-block-scout.service';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.ScrollBlockScout}`)
@ApiTags(`Integrations: "${IntegrationNames.ScrollBlockScout}"`)
export class ScrollBlockScoutController {
  constructor(private readonly scrollBlockScoutService: ScrollBlockScoutService) {}
}
