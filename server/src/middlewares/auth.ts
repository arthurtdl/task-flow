import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "./httpException";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new HttpException(401, "Unauthorized. Token missing or invalid."),
    );
  }

  const [, token] = authHeader.split(" ");

  try {
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (!accessSecret) {
      throw new Error('FATAL ERROR: JWT_ACCESS_SECRET is not defined.');
    }

    // Verify if:
    // correct signature; token has not expired; the token was created using the same secret key
    const decoded = jwt.verify(token, accessSecret) as {
      id: string;
      role: string;
    };

    // Inject the ID and Role into the request
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;

    next();
  } catch (_error) {
    return next(
      new HttpException(
        401,
        `Unauthorized. Token expired or invalid.`,
      ),
    );
  }
}
