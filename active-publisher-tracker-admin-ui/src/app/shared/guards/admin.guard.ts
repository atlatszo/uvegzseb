import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Role, TRole } from '../classes/role';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.getLoggedInUserRole();
  }

  private getLoggedInUserRole(): Observable<boolean> {
    return this.apiService.getLoggedInUserRole().map((role: TRole) => {
      if (role === Role.ADMIN || role === Role.CONFIGURATOR) {
        return true;
      }
      this.router.navigateByUrl('/unauthorized');
      return false;
    });
  }

}
