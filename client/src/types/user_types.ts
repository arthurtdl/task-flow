export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN'; 
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}