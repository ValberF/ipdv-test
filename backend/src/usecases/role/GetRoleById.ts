import RoleRepository from '../../domain/repositories/RoleRepository';
import { Role } from '../../domain/entities/Role';

class GetRoleById {
  async execute({ id }: { id: string }): Promise<Role | null> {
    return await RoleRepository.findById(id);
  }
}

export default new GetRoleById();