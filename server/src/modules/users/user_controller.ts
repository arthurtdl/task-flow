import { Request, Response } from 'express';
import UserService from './user_service';

class UsersController {
  
  create = async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
      message: 'User created successfully.',
      data: user,
    });
  };

  getUserByEmail = async (req: Request, res: Response) => {
    const email = req.params.email as string;

    const user = await UserService.getUserByEmail(email);

    res.status(200).json({
      message: 'User retrieved successfully.',
      data: user,
    });
  };
}

export default new UsersController();