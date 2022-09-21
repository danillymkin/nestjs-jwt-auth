import { TOKEN_SERVICE } from './interfaces/token-service.interface';
import { TokenServiceImpl } from './token.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    {
      useClass: TokenServiceImpl,
      provide: TOKEN_SERVICE,
    },
  ],
  exports: [{ useClass: TokenServiceImpl, provide: TOKEN_SERVICE }],
})
export class TokenModule {}
