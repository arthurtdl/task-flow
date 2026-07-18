import prisma from "@database";
import { Prisma, User } from "@prisma/client";

class UserRepository {
    async createUser(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({data});
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    }
}

export default new UserRepository();