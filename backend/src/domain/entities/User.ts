import { IUser } from "../interfaces/IUser";

export class User implements IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  role_id: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;

  constructor({ id, name, email, password, role_id, status = true, created_at, updated_at, deleted_at }: IUser) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role_id = role_id;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }
}