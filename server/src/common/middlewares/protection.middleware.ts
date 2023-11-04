/*external modules*/
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
/*other*/
import { IClientMetadata } from '@common/types';
import { ProtectionService } from '../../modules/protection/protection.service';

@Injectable()
export class ProtectionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly protectionService: ProtectionService,
  ) {}

  public async use(req: Request & { clientMetadata: IClientMetadata }, res: Response, next: NextFunction) {
    const verificationEnabled = this.configService.getOrThrow<string>(
      'protection.protectionSignatureVerificationEnabled',
    );
    this.logger.debug(`Request: [${req.method.toUpperCase()}] ${req.url}`, {
      verificationEnabled,
    });

    if (verificationEnabled) {
      await this.protectionService.verifyRequest(req);
    }

    const clientMetadata = this.protectionService.getClientMetadata(req);
    req.clientMetadata = clientMetadata;

    next();
  }
}
