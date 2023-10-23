/*external modules*/
import { Request } from 'express';
import { createParamDecorator } from '@nestjs/common';
/*@interfaces*/
/*@entities*/

export const RequesterIp = createParamDecorator((data, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest();

  const rawIp = (req.headers['X-Real-IP'] ||
    req.headers['X-Forwarded-For'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress) as string;

  return rawIp.replaceAll(/[^\d.-]/g, '');
});
