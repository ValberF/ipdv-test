import UserRepository from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

class GetAllUsers {
  async execute(): Promise<User[]> {
    return await UserRepository.findAll();
  }
}

export default new GetAllUsers();