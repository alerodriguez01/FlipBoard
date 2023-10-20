import { Salt } from "@prisma/client";

export default interface SaltDataSource {
  createSalt(salt: Salt): Promise<Salt>;
  getSaltByUsuarioId(userId: string): Promise<Salt | null>;
}