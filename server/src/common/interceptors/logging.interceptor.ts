/*external modules*/
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
/*modules*/
/*adapters*/
/*providers*/
/*common*/
import { IpHelper } from '../helpers';
import { Socket } from 'socket.io';
/*libs*/
/*db*/
/*other*/

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly ipHelper: IpHelper) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    let token: string;
    let trace: Record<
      string,
      string | number | Date | Record<string, unknown>
    > = {};

    switch (context.getType()) {
      case 'http': {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        const rawIp = this.ipHelper.getHTTPRawIp(request);

        token = `HTTP ${request.method} "${request.path}"`;
        trace = {
          rawIp: rawIp,
          ip: this.ipHelper.convertRawIp(rawIp),
          body: request.body,
          query: request.query,
          cookies: request.cookies,
          timestamp: new Date(),
        };

        break;
      }
      case 'rpc': {
        const rpcContext = context.switchToRpc();

        const path = (rpcContext.getContext().args ?? []).join('/');
        const data = rpcContext.getData();

        token = `RPC "${path}"`;
        trace = {
          data,
          timestamp: new Date(),
        };

        break;
      }
      case 'ws': {
        const wsContext = context.switchToWs();
        const client = wsContext.getClient() as Socket;

        const rawIp = this.ipHelper.getSocketRawIp(client);

        const data = wsContext.getData();
        const path = client.data.event;

        token = `WS "${path}"`;
        trace = {
          rawIp: rawIp,
          ip: this.ipHelper.convertRawIp(rawIp),
          data: data,
          timestamp: new Date(),
        };

        break;
      }
    }

    this.logger.verbose(token, trace);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `[${token}] Execution time: ${((Date.now() - now) / 1000).toFixed(
              2,
            )}s`,
          ),
        ),
      );
  }
}
