import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const DEBANK_HOST = 'https://api.debank.com';

@Injectable()
export class DebankService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly httpService: HttpService) {}

  public async getBalanceList(address: string, cache = true) {
    const route = cache ? 'cache_balance_list' : 'balance_list';
    const url = `${DEBANK_HOST}/token/${route}?user_addr=${address}`;

    try {
      const result = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
          },
        }),
      );

      return result.data;
    } catch (e) {
      this.logger.error('Balance request error: ', e);
      throw e;
    }
  }
}
