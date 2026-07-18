import bcrypt from 'bcryptjs';
import UserRepository from './user_repository';
import { CreateUserDTO } from './DTOs/create_user_dto';
import { HttpException } from './../../middlewares/httpException';

export class UserService {

    async createUser(data: CreateUserDTO) {
    // Verify if the email is already in use
    const userExists = await UserRepository.getUserByEmail(data.email);
    if (userExists) {
      throw new HttpException(409, 'Este e-mail já está em uso.');
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
}