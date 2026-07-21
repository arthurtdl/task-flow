import { Request, Response, NextFunction } from 'express';
import auth from './auth';
import { normalize } from './../utils/normalize'

// Define who access without authentication
const PUBLIC_ROUTES: { method: string; path: string }[] = [
  { method: 'POST', path: '/users' },      // Sign up
  { method: 'POST', path: '/auth/login' }, // Sign in
  { method: 'GET', path: '/' },
  { method: "GET", path: "/auth/me" },
  { method: "POST", path: "/auth/logout" },
];

export default function authGate(req: Request, res: Response, next: NextFunction) {
  const reqPath = normalize(req.path);
  
  const isPublic = PUBLIC_ROUTES.some(
    (r) => r.method === req.method && r.path === reqPath
  );

  if (isPublic) return next();

  // If its not public, lets verify
  return auth(req, res, next);
}