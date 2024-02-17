import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LineaExplorerService } from './linea-explorer.service';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.LineaExplorer}`)
@ApiTags(`Integrations: "${IntegrationNames.LineaExplorer}"`)
export class LineaExplorerController {
  constructor(private readonly lineaExplorerService: LineaExplorerService) {}
}
