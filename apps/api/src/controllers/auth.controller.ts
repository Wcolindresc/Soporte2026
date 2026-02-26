import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export const AuthController = {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    res.json(await service.login(username, password));
  },
  async refresh(req: Request, res: Response) {
    res.json(await service.refresh(req.body.refreshToken));
  },
  async logout(req: Request, res: Response) {
    res.json(await service.logout(req.body.refreshToken));
  }
};
