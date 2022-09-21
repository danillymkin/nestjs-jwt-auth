import { RoleResponse } from '../types/role-response.type';
import { RoleName } from '@prisma/client';

export const ROLE_SERVICE = 'ROLE_SERVICE';

export interface RoleService {
  getByName(name: RoleName): Promise<RoleResponse>;
}
