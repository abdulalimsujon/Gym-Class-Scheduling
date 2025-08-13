export enum UserRole {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  TRAINEE = 'TRAINEE',
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  isDeleted?: boolean;
  updatedAt: Date;
}
