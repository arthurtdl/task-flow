import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../users/user_repository';
import { LoginDTO } from './DTOs/login_dto';
import { HttpException } from '../../middlewares/httpException';

class AuthService {
  async login(data: LoginDTO) {
    const user = await UserRepository.getUserByEmail(data.email);
    
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

  async me(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(401, 'Nenhum token de atualização fornecido.');
    }

    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
      const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };

      const user = await UserRepository.getUserById(decoded.id);
      
      if (!user) {
        throw new HttpException(404, 'Usuário não encontrado.');
      }

      const accessSecret = process.env.JWT_ACCESS_SECRET as string;
      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role }, 
        accessSecret,
        { expiresIn: '15m' }
      );

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch {
      throw new HttpException(401, 'Refresh token inválido ou expirado.');
    }
  }

  async logout() {
    return { success: true }
  }
}

export default new AuthService();