/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICurrentUserData } from '@common/interfaces/auth';
import { UserEntity } from '@entities/user';

@Injectable()
export class PhoneExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: ICurrentUserData = request.user;

    if (!data) throw new NotFoundException('User not found');
    if (data.isAdmin) return true;

    const user = data.info as UserEntity;
    if (!user.phone) throw new ForbiddenException('Phone is required.');

    return true;
  }
}
