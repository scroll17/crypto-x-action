import { HttpException, HttpStatus, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(this.constructor.name);

  protected defaultConnection: Redis;
  protected connections: Redis[] = [];

  constructor(private configService: ConfigService) {
    this.defaultConnection = new Redis(this.getDefaultOptions());
  }

  public async onModuleInit() {
    await this.isConnected();
  }

  public async onModuleDestroy() {
    await Promise.all([this.defaultConnection, ...this.connections].map((conn) => conn.quit()));
  }

  private getDefaultOptions() {
    return {
      port: this.configService.getOrThrow('redis.port'),
      host: this.configService.getOrThrow('redis.host'),
      keyPrefix: `${this.configService.getOrThrow('env')}:`,
    };
  }

  public getDefaultConnection() {
    return this.defaultConnection;
  }

  public createConnection(options: RedisOptions = {}) {
    const connection = new Redis({
      ...this.getDefaultOptions(),
      ...options,
    });
    this.connections.push(connection);

    this.logger.verbose('Created connection to Redis', this.getDefaultConnection());

    return connection;
  }

  public async closeConnection(connection: Redis) {
    if (connection === this.defaultConnection) {
      throw new Error(`Forbidden to close default Redis connection`);
    }

    this.connections = this.connections.filter((conn) => conn !== connection);

    await connection.quit();

    this.logger.verbose('Closed connection to Redis', connection.options);
  }

  async isConnected(connection = this.defaultConnection) {
    const ping = await connection.ping();
    if (ping !== 'PONG') {
      throw new HttpException('Redis disconnected.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
