import * as fs from 'node:fs';
import { AppConstants } from '../../app.constants';
import { TIntegrationSeed } from '@common/types/integrations';

export const integrationsConfiguration = (): {
  integrations: Array<TIntegrationSeed>;
} => {
  const integrationsFilePath = AppConstants.Env.IntegrationsFilePath;
  fs.accessSync(integrationsFilePath, fs.constants.R_OK | fs.constants.W_OK);

  const integrations = JSON.parse(
    fs.readFileSync(integrationsFilePath, {
      encoding: 'utf8',
    }),
  );

  return { integrations: integrations };
};
