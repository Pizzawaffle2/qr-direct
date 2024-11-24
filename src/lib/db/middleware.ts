// src/lib/db/middleware.ts
import {PrismaClient } from '@prisma/client';

export function withMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    // Logging
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();

    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);

    return result;
  });

  prisma.$use(async (params, next) => {
    // Check for soft deletes
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deleted: true };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data.deleted = true;
      } else {
        params.args.data = { deleted: true };
      }
    }
    return next(params);
  });

  return prisma;
}
