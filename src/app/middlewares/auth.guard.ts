import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import config from '../config';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export default function AuthGuard(...roles: string[]): Type<CanActivate> {
  @Injectable()
  class AuthGuardImpl implements CanActivate {
    constructor(readonly jwtService: JwtService) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new HttpException('Unauthorized', 401);

      const decoded = this.jwtService.verify<JwtPayload>(token, {
        secret: config.jwt.accessTokenSecret,
      });
      if (!decoded) throw new HttpException('Unauthorized', 401);

      if (roles.length && !roles.includes(decoded.role)) {
        throw new HttpException('Forbidden', 403);
      }
      request.user = decoded;
      return true;
    }
  }
  return mixin(AuthGuardImpl);
}
