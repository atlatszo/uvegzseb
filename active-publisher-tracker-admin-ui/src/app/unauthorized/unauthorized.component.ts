import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit, OnDestroy {

  public translationKey = 'unauthorized.';
  public count = 5;
  private subscriptions: Array<Subscription> = [];
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor() { }

  ngOnInit(): void {
    this.startCountDown();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  private startCountDown(): void {
    const timer = Observable.timer(2000, 1000).takeWhile(() => this.count > 0);
    this.subscriptions.push(timer.subscribe(() => {
      --this.count;
      if (!this.count) {
        const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token'));
        const location = window.location;
        const issuer = decodedToken.iss;
        const realm = issuer.split('/');
        window.location.href = location.protocol + '//' + location.host + '/' +
          realm[realm.length - 1].toLowerCase() + '/active-publisher-tracker-frontend/';
      }
    }));
  }
}
