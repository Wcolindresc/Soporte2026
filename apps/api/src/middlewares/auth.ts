import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; permissions: string[] };
    }
  }
}

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next({ status: 401, message: 'Token no proporcionado' });
  }
  try {
    req.user = verifyAccessToken(authHeader.slice(7)) as any;
    next();
  } catch {
    next({ status: 401, message: 'Token inválido' });
  }
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.permissions?.includes(permission)) {
      return next({ status: 403, message: 'Sin permisos suficientes' });
    }
    next();
  };
}
