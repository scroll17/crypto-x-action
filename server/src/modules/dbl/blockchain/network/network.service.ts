import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockchainNetworkService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly configService: ConfigService) {}
}
