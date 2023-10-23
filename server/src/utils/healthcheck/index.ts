import { Logger } from '@nestjs/common';
import * as express from 'express';

export function runHealthcheckServer(port: number, serverName: string) {
  const logger = new Logger('HealthCheckServer:' + serverName);

  const app = express();
  logger.debug('Init server', {
    port,
    serverName,
  });

  app.get('/', (req, res) => {
    logger.debug('HEALTHY CHECK');
    res.send('1');
  });

  app.listen(port, () => {
    logger.verbose(`Listening on port ${port}`);
  });
}
