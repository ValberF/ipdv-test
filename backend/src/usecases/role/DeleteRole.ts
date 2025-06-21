import RoleRepository from '../../domain/repositories/RoleRepository';

class DeleteRole {
  async execute({ id }: { id: string }): Promise<{ success: boolean; message?: string }> {
    const userCount = await RoleRepository.countUsersWithRole(id);
    if (userCount > 0) {
      return {
        success: false,
        message: 'Não é possível excluir o cargo pois existem usuários vinculados a ele.',
      };
    }
    const deleted = await RoleRepository.delete(id);
    if (!deleted) {
      return {
        success: false,
        message: 'Cargo não encontrado.',
      };
    }
    return { success: true };
  }
}

export default new DeleteRole();