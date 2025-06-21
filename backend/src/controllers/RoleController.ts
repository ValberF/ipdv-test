import { Request, Response } from 'express';
import CreateRole from '../usecases/role/CreateRole';
import GetAllRoles from '../usecases/role/GetAllRoles';
import GetRoleById from '../usecases/role/GetRoleById';
import UpdateRole from '../usecases/role/UpdateRole';
import DeleteRole from '../usecases/role/DeleteRole';

export default {
  async getAll(req: Request, res: Response) {
    const roles = await GetAllRoles.execute();
    res.json(roles);
  },
  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const role = await GetRoleById.execute({ id });
    if (!role) return res.sendStatus(404);
    res.json(role);
  },
  async create(req: Request, res: Response) {
    const role = await CreateRole.execute({ name: req.body.name });
    res.status(201).json(role);
  },
  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const updated = await UpdateRole.execute({ id, name: req.body.name });
    if (!updated) return res.sendStatus(404);
    res.sendStatus(204);
  },
  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await DeleteRole.execute({ id });
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.sendStatus(204);
  }
};