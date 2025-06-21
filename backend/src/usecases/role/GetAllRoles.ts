import RoleRepository from '../../domain/repositories/RoleRepository';
import { Role } from '../../domain/entities/Role';

class GetAllRoles {
  async execute(): Promise<Role[]> {
    return await RoleRepository.findAll();
  }
}

export default new GetAllRoles();