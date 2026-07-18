import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    // Validate the request body against the provided schema
    req.body = await schema.parseAsync(req.body);
    next();
  };
};