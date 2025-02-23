import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuth implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.getTokenFromHeader(request.headers);

      if (!token) throw new BadRequestException('token is not provided');

      const payload = await this.jwtService.verify(token);
      request.id = payload.id;
      request.subscriptionPlan = payload.subscriptionPlan;
      request.role = payload.role;

      return true;
    } catch (e) {
      console.log(e, 'eroor');
      throw new UnauthorizedException(`permition dined`);
    }
  }

  getTokenFromHeader(headers) {
    const authorization = headers['authorization'];
    if (!authorization) return null;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
