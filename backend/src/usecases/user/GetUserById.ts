import UserRepository from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

class GetUserById {
  async execute({ id }: { id: string }): Promise<User | null> {
    return await UserRepository.findById(id);
  }
}

export default new GetUserById();