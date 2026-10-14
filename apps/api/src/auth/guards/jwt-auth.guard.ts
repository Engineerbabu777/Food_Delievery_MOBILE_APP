import { JwtPayload } from '@food-delivery/types';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'node:http';

type AuthenticatedRequest = IncomingMessage & {
  user: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Auth token is required');
    }

    const tokenFormat = token.startsWith('Bearer ') ? token.slice(7) : token;

    if (!tokenFormat) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      request.user = this.jwtService.verify<JwtPayload>(tokenFormat);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
