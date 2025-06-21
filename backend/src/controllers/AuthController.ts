import { Request, Response } from 'express';
import LoginUser from '../usecases/auth/LoginUser';
import RefreshToken from '../usecases/auth/RefreshToken';
import LogoutUser from '../usecases/auth/LogoutUser';

export default {
  async login(req: Request, res: Response) {
    try {
      const { accessToken, refreshToken } = await LoginUser.execute(req.body);
      res.json({ accessToken, refreshToken });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
  async refresh(req: Request, res: Response) {
    try {
      const { accessToken } = await RefreshToken.execute({ refreshToken: req.body.refreshToken });
      res.json({ accessToken });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
  async logout(req: Request, res: Response) {
    await LogoutUser.execute({ refreshToken: req.body.refreshToken });
    res.sendStatus(204);
  }
};