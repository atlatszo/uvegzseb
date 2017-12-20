import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Role, TRole } from '../shared/classes/role';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public translationKey = 'header.';
  public isAdministrator: boolean;
  public logoutLink;
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getLoggedInUserRole();
    this.initLogoutLink();
  }

  private initLogoutLink() {
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
    const location = window.location;
    const issuer = decodedToken.iss;
    const realm = issuer.split('/');
    this.logoutLink = issuer + '/protocol/openid-connect/logout?redirect_uri=' + location.protocol + '//' + location.host + '/' +
      realm[realm.length - 1].toLowerCase() + '/active-publisher-tracker-admin-frontend/';
  }

  private getLoggedInUserRole(): void {
    this.apiService.getLoggedInUserRole().subscribe(
      (role: TRole) => {
        this.isAdministrator = role === Role.ADMIN || role === Role.CONFIGURATOR;
      },
      error => console.error(error)
    );
  }

}
