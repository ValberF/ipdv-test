import UserRepository from '../../domain/repositories/UserRepository';
import RefreshTokenRepository from '../../domain/repositories/RefreshTokenRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class LoginUser {
  async execute({ email, password }: { email: string; password: string }): Promise<{ accessToken: string, refreshToken: string }> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Usuário ou senha inválidos');
      (error as any).status = 401;
      throw error;
    }

    if (user.status === false) {
      const error = new Error('Usuário inativo. Entre em contato com o administrador.');
      (error as any).status = 403;
      throw error;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const error = new Error('Usuário ou senha inválidos');
      (error as any).status = 401;
      throw error;
    }

    const payload = { id: user.id, email: user.email, name: user.name, role_id: user.role_id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '60m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshTokenRepository.add({
      user_id: user.id!,
      token: refreshToken,
      expires_at: expiresAt
    });

    return { accessToken, refreshToken };
  }
}

export default new LoginUser();