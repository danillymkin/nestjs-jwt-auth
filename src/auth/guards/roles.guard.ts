import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Prisma, Role, RoleName } from '@prisma/client';
import { ROLES_KEY } from '../utils/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const user: Prisma.UserGetPayload<{ include: { roles: true } }> = context
        .switchToHttp()
        .getRequest()?.user;

      return user.roles.some((role: Role) =>
        requiredRoles.includes(<RoleName>role.name),
      );
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
