export type Role = "ADMIN" | "STAFF" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  token: string;
  expires: number;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export type UserReference = Pick<User, "id">;
