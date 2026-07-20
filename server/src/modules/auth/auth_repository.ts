import prisma from "@database";
import { User } from "@prisma/client";

class AuthRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}

export default new AuthRepository();