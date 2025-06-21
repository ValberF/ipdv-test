export interface Role {
  id: number
  name: string
}

export interface User {
  id: number
  name: string
  email: string
  password?: string
  role_id: string
  role?: Role
  status: boolean
}