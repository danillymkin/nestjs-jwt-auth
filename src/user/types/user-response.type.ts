import { Prisma } from '@prisma/client';
import { roleResponse } from '../../role/types/role-response.type';

export const userResponse = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    roles: {
      ...roleResponse,
    },
  },
});

export type UserResponse = Prisma.UserGetPayload<typeof userResponse>;
