import pool from '../../config/db';
import { Role } from '../entities/Role';
import { IRole } from '../interfaces/IRole';
import { v4 as uuidv4 } from 'uuid';

class RoleRepository {
  async findAll(): Promise<Role[]> {
    const { rows } = await pool.query(
      'SELECT * FROM role WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
    return rows.map((row: IRole) => new Role(row));
  }

  async findById(id: string): Promise<Role | null> {
    const { rows } = await pool.query('SELECT * FROM role WHERE id = $1 AND deleted_at IS NULL', [id]);
    return rows[0] ? new Role(rows[0]) : null;
  }

  async create(name: string): Promise<Role> {
    const id = uuidv4();
    const { rows } = await pool.query(
      'INSERT INTO role (id, name) VALUES ($1, $2) RETURNING *',
      [id, name]
    );
    return new Role(rows[0]);
  }

  async update(id: string, name: string): Promise<boolean> {
    const { rowCount } = await pool.query(
      'UPDATE role SET name = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL',
      [name, id]
    );
    return (rowCount ?? 0) > 0;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query(
      'UPDATE role SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return (rowCount ?? 0) > 0;
  }

  async countUsersWithRole(roleId: string): Promise<number> {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM "user" WHERE role_id = $1 AND deleted_at IS NULL',
      [roleId]
    );
    return parseInt(rows[0].count, 10);
  }
}

export default new RoleRepository();