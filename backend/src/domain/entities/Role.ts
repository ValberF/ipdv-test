import { IRole } from "../interfaces/IRole";

export class Role implements IRole {
  id?: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;

  constructor({ id, name, created_at, updated_at, deleted_at }: IRole) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }
}