export interface IAccountForm {
  id?: number;
  email?: string;
  passwords: {
    password?: string;
    confirmPassword?: string;
  };
  isAdmin?: boolean;
}
