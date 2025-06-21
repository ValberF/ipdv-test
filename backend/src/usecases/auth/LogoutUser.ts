import RefreshTokenRepository from '../../domain/repositories/RefreshTokenRepository';

class LogoutUser {
  async execute({ refreshToken }: { refreshToken: string }): Promise<void> {
    if (refreshToken) {
      await RefreshTokenRepository.revoke(refreshToken);
    }
  }
}

export default new LogoutUser();