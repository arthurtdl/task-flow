import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { HttpException } from './httpException';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {

  // Verify if error is an instance of HttpException
  if (err instanceof HttpException) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Verify if error is an instance of ZodError
  if (err instanceof ZodError) {
    const errorMessages = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    res.status(400).json({ 
      message: 'Falha na validação dos dados.', 
      errors: errorMessages 
    });
    return;
  }

  // Verify if error is an instance of PrismaClientKnownRequestError
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Registro não encontrado no banco de dados.' });
      return;
    }
    
    // Verify if error is a unique constraint violation error
    if (err.code === 'P2002') {
      res.status(409).json({ message: 'Esse registro já existe no sistema.' });
      return;
    }
  }


  console.error('Internal Error:', err);
  res.status(500).json({ message: 'Internal error from server.' });
};