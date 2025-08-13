export type TLoginUser = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'TRAINER' | 'TRAINEE';
};
