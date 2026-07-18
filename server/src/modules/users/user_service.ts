import bcrypt from 'bcryptjs';
import UserRepository from './user_repository';
import { CreateUserDTO } from './DTOs/create_user_dto';
import { HttpException } from './../../middlewares/httpException';

class UserService {

    async createUser(data: CreateUserDTO) {
    // Verify if the email is already in use
    const userExists = await UserRepository.getUserByEmail(data.email);
    if (userExists) {
      throw new HttpException(409, 'This email is already in use.');
    }

    // Crypt the password before saving it to the database
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    });

    // Return the user without the password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }

  async getUserByEmail(email: string) {
    const user = await UserRepository.getUserByEmail(email);
    
    // If the user is not found, throw an HttpException
    if (!user) {
      throw new HttpException(404, 'User not found.');
    }

    // Return the user without the password hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

}

export default new UserService();