export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirm?: string;
  role?: "admin" | "user";
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  status?: boolean;
}
