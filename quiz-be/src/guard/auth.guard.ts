import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/lib/constants';
import UserEntity from '../user/user.entity';

export default class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers?.jwt;
      const { userId } = jwt.verify(jwtToken, JWT_SECRET) as { userId: number };
      const user = await UserEntity.findOne({ where: { id: userId } });
      if (user) {
        request.user = user;
        return true;
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
