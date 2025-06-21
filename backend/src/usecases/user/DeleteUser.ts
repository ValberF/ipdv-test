import UserRepository from '../../domain/repositories/UserRepository';

class DeleteUser {
  async execute({ id }: { id: string }): Promise<boolean> {
    return await UserRepository.delete(id);
  }
}

export default new DeleteUser();