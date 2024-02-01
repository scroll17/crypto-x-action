import {HttpException, HttpStatus, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {IntegrationNames} from "@common/integrations/common";

const DEBANK_HOST = 'https://api.debank.com';

const HOST = 'https://min-api.cryptocompare.com';

@Injectable()
export class CryptoCompareService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.CryptoCompare;

  private readonly logger = new Logger(this.constructor.name);

  private integrationRec: '';

  private readonly cachedPrice: Map<string, Record<string, number>> = new Map();

  constructor(private readonly httpService: HttpService) {}

  public async onModuleInit() {
    this.logger.verbose(`Load integration record by key: "${this.INTEGRATION_KEY}"`, { key: this.INTEGRATION_KEY });

    await this.getPrices('ETH', ['USD', 'EUR']);
    await this.getPrices('ETH', ['BTC']);
  }

  private isErrorResponse(data: Record<string, unknown>) {
    //     Response: 'Error',
    //     Message: 'Path does not exist',
  }

  private getCachedPrice(fromSymbol: string, toSymbols: string[]) {

  }

  public async getPrices(fromSymbol: string, toSymbols: string[], cache = true) {
    if (toSymbols.length === 0) {
      throw new HttpException('Passed invalid "toSymbols"', HttpStatus.BAD_REQUEST);
    }

    const query = new URLSearchParams(toSymbols.map((s) => ['tsyms', s]));
    query.append('fsym', fromSymbol);

    const url = `${HOST}/data/price?${query.toString()}`;

    try {
      const { data } = await firstValueFrom(this.httpService.get<Record<string, number>>(url));

      const prevCache = this.cachedPrice.get(fromSymbol) ?? {};
      this.cachedPrice.set(fromSymbol, { ...prevCache, ...data });

      return data;
    } catch (error) {
      this.logger.error('Price request error: ', error);
      throw error;
    }
  }

  public async getPrice(fromSymbol: string, toSymbol: string, cache = true) {

  }
}
