/*external modules*/
import { createParamDecorator } from '@nestjs/common';
/*@interfaces*/
import { ICurrentUserData } from '@common/interfaces/auth';
/*@entities*/
import { UserModel } from '@entities/user';
import { AdminModel } from '@entities/admin';

export const CurrentUser = createParamDecorator<keyof UserModel | keyof AdminModel>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user: ICurrentUserData = request.user;

  return data ? (user?.info as any)[data] : user;
});
