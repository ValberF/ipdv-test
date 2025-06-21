import { Request, Response } from 'express';
import CreateUser from '../usecases/user/CreateUser';
import GetAllUsers from '../usecases/user/GetAllUsers';
import GetUserById from '../usecases/user/GetUserById';
import UpdateUser from '../usecases/user/UpdateUser';
import DeleteUser from '../usecases/user/DeleteUser';

export default {
  async getAll(req: Request, res: Response) {
    const users = await GetAllUsers.execute();
    res.json(users);
  },
  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const user = await GetUserById.execute({ id });
    if (!user) return res.sendStatus(404);
    res.json(user);
  },
  async getMe(req: Request, res: Response) {
    const id = (req as any).user.id;
    const user = await GetUserById.execute({ id });
    if (!user) return res.sendStatus(404);
    res.json(user);
  },
  async create(req: Request, res: Response) {
    try {
      const user = await CreateUser.execute(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const updated = await UpdateUser.execute({ id, ...req.body });
    if (!updated) return res.sendStatus(404);
    res.sendStatus(204);
  },
  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const deleted = await DeleteUser.execute({ id });
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
  }
};