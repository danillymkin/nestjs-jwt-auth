import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleService } from './interfaces/role-service.interface';
import { PrismaService } from '../prisma/prisma.service';
import { roleResponse, RoleResponse } from './types/role-response.type';
import { RoleName } from '@prisma/client';

@Injectable()
export class RoleServiceImpl implements RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(RoleServiceImpl.name);

  public async getByName(name: RoleName): Promise<RoleResponse> {
    try {
      const role: RoleResponse =
        await this.prismaService.role.findUniqueOrThrow({
          where: { name },
          ...roleResponse,
        });

      this.logger.log(
        `IN RoleServiceImpl::getByName - role with id: ${role.id} found by name: ${name}`,
      );

      return role;
    } catch (e) {
      this.logger.log(
        `IN RoleServiceImpl::getByName - role not found by name: ${name}`,
      );

      throw new NotFoundException(`Роль с именем ${name} не найдена`);
    }
  }
}
