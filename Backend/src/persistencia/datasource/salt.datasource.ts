import { Salt } from "@prisma/client";

export default interface SaltDataSource {
  createSalt(salt: Salt): Promise<Salt>;
}