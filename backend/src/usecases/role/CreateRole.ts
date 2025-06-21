import RoleRepository from '../../domain/repositories/RoleRepository';
import { Role } from '../../domain/entities/Role';

class CreateRole {
  async execute({ name }: { name: string }): Promise<Role> {
    return await RoleRepository.create(name);
  }
}

export default new CreateRole();