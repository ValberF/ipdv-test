export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  role_id: string;
  status?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}