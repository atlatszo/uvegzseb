import { Role, TRole } from './role';

export class Account {

  public id: number;
  public email: string;
  public lastLoginDate: string;
  public role: TRole;

  public static getDummyAccount(): Account {
    return new Account(-1, '', '', Role.CONFIGURATOR);
  }

  constructor(id: Account | number, email?: string, lastLoginDate?: string, role?: TRole) {
    if (typeof id === 'object' && !Array.isArray(id) && id !== null) {
      this.initWithObject(<Account>id);
    } else {
      this.initWithParams(<number>id, email, lastLoginDate, role);
    }
  }

  private initWithParams(id: number, email: string, lastLoginDate: string, role: TRole): void {
    this.id = id;
    this.email = email;
    this.lastLoginDate = lastLoginDate;
    this.role = role;
  }

  private initWithObject(account: Account): void {
    this.id = account.id;
    this.email = account.email;
    this.lastLoginDate = account.lastLoginDate;
    this.role = account.role;
  }

}
