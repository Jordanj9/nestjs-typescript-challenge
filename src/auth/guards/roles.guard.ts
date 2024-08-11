import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorador';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class RolesGuard implements CanActivate {
  constructor( private reflector: Reflector, private jwtService: JwtService
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = this.jwtService.verify(request.headers.authorization.split(' ')[1]);
    return roles.includes(user.role);
  }
}