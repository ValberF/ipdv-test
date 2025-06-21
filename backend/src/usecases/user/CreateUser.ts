import UserRepository from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { IUser } from '../../domain/interfaces/IUser';
import bcrypt from 'bcrypt';

class CreateUser {
  async execute({ name, email, password, role_id, status = true }: IUser): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    try {
      return await UserRepository.create({ name, email, password: hash, role_id, status });
    } catch (err: any) {
      if (err.code === '23505') {
        const error = new Error('Email already registered');
        (error as any).status = 400;
        throw error;
      }
      throw err;
    }
  }
}

export default new CreateUser();