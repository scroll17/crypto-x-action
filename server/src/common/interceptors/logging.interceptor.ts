/*external modules*/
import { CallHandler, ContextType, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
/*modules*/
/*adapters*/
/*providers*/
/*common*/
/*libs*/
/*db*/
/*other*/

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    let token: string | null = null;
    let trace: Record<string, string | number | Date> = {};

    // console.log('getType => ', context.getType())
    // console.log('switchToWs => ', context.switchToWs())
    // console.log('switchToWs getContext => ', context.switchToWs().getClient())
    // console.log('switchToWs getData => ', context.switchToWs().getData())

    switch (context.getType()) {
      case 'http': {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        token = `HTTP ${request.method} "${request.path}"`;
        trace = {
          body: request.body,
          query: request.query,
          headers: request.headers,
          timestamp: new Date(),
        };

        break;
      }
      case 'telegraf' as ContextType: {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        token = `Telegraf ${request.method} "${request.path}"`;
        trace = {
          body: request.body,
          query: request.query,
          headers: request.headers,
          timestamp: new Date(),
        };
      }
    }

    this.logger.debug(token ?? '<token>', trace);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => this.logger.debug(`[${token}] Execution time: ${((Date.now() - now) / 1000).toFixed(2)}s`)));
  }
}
