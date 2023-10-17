import { PrismaClient } from "@prisma/client";

// Prisma Singleton
// Prevents creating multiple clients
const prismaClientSingleton = () => {
  return new PrismaClient();
}
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;