import { ROLE_SERVICE } from './interfaces/role-service.interface';
import { RoleServiceImpl } from './role.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [{ useClass: RoleServiceImpl, provide: ROLE_SERVICE }],
  exports: [{ useClass: RoleServiceImpl, provide: ROLE_SERVICE }],
})
export class RoleModule {}
