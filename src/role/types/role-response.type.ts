import { Prisma } from '@prisma/client';

export const roleResponse = Prisma.validator<Prisma.RoleArgs>()({
  select: {
    id: true,
    name: true,
  },
});

export type RoleResponse = Prisma.RoleGetPayload<typeof roleResponse>;
