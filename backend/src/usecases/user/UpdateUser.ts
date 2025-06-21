import { IUser } from '../../domain/interfaces/IUser';
import UserRepository from '../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';

class UpdateUser {
  async execute({ id, name, email, password, role_id, status }: Partial<IUser> & { id: string }): Promise<boolean> {
    let hash: string | undefined = undefined;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }
    return await UserRepository.update({ id, name, email, password: hash, role_id, status });
  }
}

export default new UpdateUser();