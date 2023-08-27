/*external modules*/
import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ICurrentUserData } from '@common/interfaces/auth';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: ICurrentUserData = request.user;

    if (!data) throw new NotFoundException('Admin not found');
    if (!data.isAdmin) {
      throw new ForbiddenException('Access only for Admin.');
    }

    return true;
  }
}
