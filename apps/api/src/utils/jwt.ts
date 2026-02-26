import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.accessTokenExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.refreshTokenExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwtRefreshSecret) as jwt.JwtPayload;
}
