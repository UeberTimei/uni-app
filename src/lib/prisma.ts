import { PrismaClient } from "@prisma/client";

const globalWithPrisma = global as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }

  return globalWithPrisma.prisma;
}

const prisma = getPrismaClient();

export default prisma;
