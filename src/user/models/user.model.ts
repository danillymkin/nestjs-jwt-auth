import { Role, User } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleModel } from '../../role/models/role.model';

export class UserModel implements User {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ description: 'Электронная почта', example: 'alice@mail.ru' })
  public email: string;

  @ApiProperty({ description: 'Пароль', example: 'StrongPassword' })
  public password: string;

  @ApiPropertyOptional({ description: 'Список ролей', type: [RoleModel] })
  public roles?: Role[];

  @ApiProperty({
    description: 'Дата создания',
    example: '2022-07-31T14:34:14.238Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Дата обнавления',
    example: '2022-07-31T14:34:14.238Z',
  })
  public updatedAt: Date;
}
