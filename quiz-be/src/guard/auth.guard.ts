import {
  CanActivate,
  ExecutionContext, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/lib/constants';
import UserEntity from '../user/user.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export default class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isOptionalAuth;
    try {
      const request = context.switchToHttp().getRequest();
      isOptionalAuth = this.reflector.get<boolean>(
        'optionalAuth',
        context.getHandler(),
      );
      const jwtToken = request.headers?.jwt;
      const { userId } = jwt.verify(jwtToken, JWT_SECRET) as { userId: number };
      const user = await UserEntity.findOne({ where: { id: userId } });
      if (user) {
        request.user = { ...user, password: undefined };
        return true;
      }
    } catch (e) {
      if (isOptionalAuth) return true;
      throw new UnauthorizedException();
    }
  }
}
