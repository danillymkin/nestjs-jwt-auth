import { USER_SERVICE } from './interfaces/user-service.interface';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [{ useClass: UserServiceImpl, provide: USER_SERVICE }],
  exports: [
    {
      useClass: UserServiceImpl,
      provide: USER_SERVICE,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
