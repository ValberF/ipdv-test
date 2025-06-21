import jwt from 'jsonwebtoken';
import RefreshTokenRepository from '../../domain/repositories/RefreshTokenRepository';

class RefreshToken {
  async execute({ refreshToken }: { refreshToken: string }): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      const error = new Error('Invalid refresh token');
      (error as any).status = 403;
      throw error;
    }

    const tokenData = await RefreshTokenRepository.find(refreshToken);
    if (!tokenData) {
      const error = new Error('Invalid refresh token');
      (error as any).status = 403;
      throw error;
    }

    // Verifica expiração
    if (new Date(tokenData.expires_at) < new Date()) {
      const error = new Error('Refresh token expired');
      (error as any).status = 403;
      throw error;
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err, user: any) => {
        if (err) {
          const error = new Error('Invalid refresh token');
          (error as any).status = 403;
          return reject(error);
        }
        const payload = { id: user.id, email: user.email, name: user.name, role_id: user.role_id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '60m' });
        resolve({ accessToken });
      });
    });
  }
}

export default new RefreshToken();