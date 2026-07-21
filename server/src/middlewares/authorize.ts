import { Request, Response, NextFunction } from "express";
import { HttpException } from "./httpException";

type Role = "ADMIN" | "USER";

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole as Role | undefined;

    if (!userRole) {
      return next(
        new HttpException(401, "Unauthorized. User role not found.")
      );
    }

    if (!roles.includes(userRole)) {
      return next(
        new HttpException(
          403,
          "Forbidden. You don't have permission to access this resource."
        )
      );
    }

    next();
  };
}