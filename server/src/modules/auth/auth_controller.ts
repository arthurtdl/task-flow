import { Request, Response } from 'express';
import AuthService from './auth_service';

class AuthController {
  
  login = async (req: Request, res: Response): Promise<void> => {
    
    const result = await AuthService.login(req.body);

    // Configure Cookie HttpOnly with the Refresh Token
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const { refreshToken: _refreshToken, ...safeData } = result;

    res.status(200).json({
      message: 'Login successful.',
      data: safeData,
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await AuthService.logout();
    res.clearCookie('refreshToken', {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
    });

    res.status(200).json({
      message: 'Logout realizado com sucesso.',
    });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    // Capture the cookie by withCredentials
    const refreshToken = req.cookies?.refreshToken;
    
    const result = await AuthService.me(refreshToken);

    res.status(200).json({
      message: 'Sessão restaurada com sucesso.',
      data: result,
    });
  };

}

export default new AuthController();