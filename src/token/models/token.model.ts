import { RefreshToken } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TokenModel implements RefreshToken {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({
    description: 'JWT токен',
    example: 'eyJhbGciOiJIUzI1Ni.eyJpZCI6MW1haWwiO.cA2XWju-fAoENALb',
  })
  public token: string;

  @ApiProperty({ description: 'ID пользователя', example: 34 })
  public userId: number;
}
