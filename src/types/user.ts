export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
  }
  
  export type UserCreate = Omit<User, "id"> & {
    password: string;
  };
  
  export type UserLogin = Pick<UserCreate, "email" | "password">;
  
  export type UserReference = Pick<User, "id">;