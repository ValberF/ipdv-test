import pool from '../../config/db';
import { User } from '../entities/User';
import { IUser } from '../interfaces/IUser';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  async findAll(): Promise<any[]> {
    const { rows } = await pool.query(`
    SELECT 
      u.id, u.name, u.email, u.status, u.created_at, u.updated_at, u.deleted_at,
      r.id as role_id, r.name as role_name, r.created_at as role_created_at, r.updated_at as role_updated_at, r.deleted_at as role_deleted_at
    FROM "user" u
    JOIN role r ON u.role_id = r.id
    WHERE u.deleted_at IS NULL
    ORDER BY u.created_at DESC
  `);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      role: {
        id: row.role_id,
        name: row.role_name,
        created_at: row.role_created_at,
        updated_at: row.role_updated_at,
        deleted_at: row.role_deleted_at,
      }
    }));
  }

  async findById(id: string): Promise<any | null> {
    const { rows } = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.status, u.created_at, u.updated_at, u.deleted_at,
        r.id as role_id, r.name as role_name, r.created_at as role_created_at, r.updated_at as role_updated_at, r.deleted_at as role_deleted_at
      FROM "user" u
      JOIN role r ON u.role_id = r.id
      WHERE u.id = $1 AND u.deleted_at IS NULL
    `, [id]);

    if (!rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      role: {
        id: row.role_id,
        name: row.role_name,
        created_at: row.role_created_at,
        updated_at: row.role_updated_at,
        deleted_at: row.role_deleted_at,
      }
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM "user" WHERE email = $1 AND deleted_at IS NULL', [email]);
    return rows[0] ? new User(rows[0]) : null;
  }

  async create({ name, email, password, role_id, status = true }: IUser): Promise<User> {
    const id = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO "user" (id, name, email, password, role_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role_id, status, created_at, updated_at, deleted_at`,
      [id, name, email, password, role_id, status]
    );
    return new User({ ...rows[0] });
  }

  async update({ id, name, email, password, role_id, status }: Partial<IUser> & { id: string }): Promise<boolean> {
    let query: string;
    let params: any[];
    if (password !== undefined) {
      query = `UPDATE "user" SET name = $1, email = $2, password = $3, role_id = $4, status = $5, updated_at = NOW() WHERE id = $6 AND deleted_at IS NULL`;
      params = [name, email, password, role_id, status, id];
    } else {
      query = `UPDATE "user" SET name = $1, email = $2, role_id = $3, status = $4, updated_at = NOW() WHERE id = $5 AND deleted_at IS NULL`;
      params = [name, email, role_id, status, id];
    }
    const { rowCount } = await pool.query(query, params);
    return (rowCount ?? 0) > 0;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query(
      `UPDATE "user" SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return (rowCount ?? 0) > 0;
  }
}

export default new UserRepository();