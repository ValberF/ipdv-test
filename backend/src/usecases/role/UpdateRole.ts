import RoleRepository from '../../domain/repositories/RoleRepository';

class UpdateRole {
  async execute({ id, name }: { id: string; name: string }): Promise<boolean> {
    return await RoleRepository.update(id, name);
  }
}

export default new UpdateRole();