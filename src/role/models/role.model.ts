import { Role, RoleName } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RoleModel implements Role {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ description: 'Название роли', example: RoleName.ADMIN })
  public name: RoleName;

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
