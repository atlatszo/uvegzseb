import { Role } from '../classes/role';

export interface IAccountUpdateRequest {
  email?: string;
  password?: string;
  role?: Role;
}
