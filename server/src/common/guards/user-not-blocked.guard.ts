/*external modules*/
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UserDocument } from '@schemas/user';

@Injectable()
export class UserNotBlocked implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const data: UserDocument = request.user;

    if (!data) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (data.blocked) {
      throw new HttpException('Usr blocked', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
