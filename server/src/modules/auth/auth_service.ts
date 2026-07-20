import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthRepository from './auth_repository';
import { LoginDTO } from './DTOs/login_dto';
import { HttpException } from '../../middlewares/httpException';

class AuthService {
  async login(data: LoginDTO) {
    const user = await AuthRepository.getUserByEmail(data.email);
    
    if (!user) {
      throw new HttpException(404, 'User not found.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials.');
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error('FATAL ERROR: JWT secrets are not defined in the environment.');
    }

    // Access token (15 minutes)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, 
      accessSecret,
      { expiresIn: '15m' }
    );

    // Refresh token (7 days)
    const refreshToken = jwt.sign(
      { id: user.id }, 
      refreshSecret,
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async logout() {
    return { success: true }
  }
}

export default new AuthService();