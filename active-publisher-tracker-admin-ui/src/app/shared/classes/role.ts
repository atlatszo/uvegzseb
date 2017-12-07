export type TRole = 'ADMIN' | 'CONFIGURATOR' | 'API_USER' | 'DISABLED_API_USER';

export class Role {

  public static ADMIN: TRole = 'ADMIN';
  public static CONFIGURATOR: TRole = 'CONFIGURATOR';
  public static API_USER: TRole = 'API_USER';
  public static DISABLED_API_USER: TRole = 'DISABLED_API_USER';

  public static isAdmin(role: TRole): boolean {
    return role === Role.ADMIN;
  }

  public static isConfigurator(role: TRole): boolean {
    return role === Role.CONFIGURATOR;
  }

}
