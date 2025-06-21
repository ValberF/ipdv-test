import pool from '../../config/db';

class RefreshTokenRepository {
  async add({ user_id, token, expires_at }: { user_id: string, token: string, expires_at: Date }) {
    await pool.query(
      `INSERT INTO refresh_token (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user_id, token, expires_at]
    );
  }

  async find(token: string) {
    const { rows } = await pool.query(
      `SELECT * FROM refresh_token WHERE token = $1 AND revoked_at IS NULL`,
      [token]
    );
    return rows[0] || null;
  }

  async revoke(token: string) {
    await pool.query(
      `UPDATE refresh_token SET revoked_at = NOW() WHERE token = $1 AND revoked_at IS NULL`,
      [token]
    );
  }
}

export default new RefreshTokenRepository();