import { Injectable } from '@angular/core';
import { Role, TRole } from '../classes/role';
import { Account } from '../classes/account';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SubscriptionsResponse } from '../classes/subscriptions-response';
import { DataOwnerOption } from '../classes/data-owner-option';
import { Crawler } from '../classes/crawler';
import { IDataOwnerFilter } from '../interfaces/data-owner-filter';
import { IAccountUpdateRequest } from '../interfaces/account-update-request';
import { DataOwnerResponse } from '../classes/data-owner-response';
import { IDataOwnerUpdateRequest } from '../interfaces/data-owner-update-request';
import { Http, Response } from '@angular/http';
import { isArray } from 'rxjs/util/isArray';
import 'rxjs/add/observable/of';

@Injectable()
export class ApiService {

  private loggedInUserRole: BehaviorSubject<TRole> = new BehaviorSubject(null);
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _userEmail: string;
  private baseUrl: { admin: string, public: string, common: string } = {admin: 'admin', public: 'public', common: 'common'};
  private backendUrl: string;

  public setIsLoading(value: boolean): void {
    this._isLoading.next(value);
  }

  get isLoading(): Observable<boolean> {
    return this._isLoading.asObservable();
  }

  get userEmail(): string {
    return this._userEmail;
  }

  constructor(private http: Http) {
    this.backendUrl = window['config']['backend'];
    this._userEmail = window['config']['email'];
  }

  public getLoggedInUserRole(): Observable<TRole> {
    if (this.loggedInUserRole.getValue()) {
      return this.loggedInUserRole.asObservable();
    } else {
      const url = `${this.backendUrl}/${this.baseUrl.admin}/user`;
      return this.http.get(url).map(resp => {
        const response: string = resp.text();
        if (Role[response]) {
          this.loggedInUserRole.next(Role[response]);
        }
        return response;
      });
    }
  }

  public getAccounts(): Observable<Array<Account>> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/users`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  public modifyAccount(accountId: number, accountUpdate: IAccountUpdateRequest): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/users/${accountId}`;
    return this.http.post(url, accountUpdate);
  }

  public addAccount(accountUpdate: IAccountUpdateRequest): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/users`;
    return this.http.post(url, accountUpdate);
  }

  public deleteAccount(accountId: number): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/users/${accountId}`;
    return this.http.delete(url);
  }

  public getSubscriptions(start: number, row: number): Observable<SubscriptionsResponse> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/subscribers?start=${start}&rows=${row}`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  public deleteSubscription(subscriberId: number): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/subscribers/${subscriberId}`;
    return this.http.delete(url);
  }

  public getDataOwnerOptions(): Observable<DataOwnerOption[]> {
    const url = `${this.backendUrl}/${this.baseUrl.public}/data-owners`;
    return this.http.get(url).map(resp => resp.json());
  }

  public getCrawlers(): Observable<Crawler[]> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/crawlers`;
    return this.http.get(url).map(resp => resp.json());
  }

  public getDataOwners(filter: IDataOwnerFilter): Observable<DataOwnerResponse> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/data-owners${this.generateDataOwnerFilterUrl(filter)}`;
    return this.http.get(url).map(resp => resp.json());
  }

  public addDataOwner(newDataOwnerUpdate: IDataOwnerUpdateRequest): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/data-owners`;
    return this.http.post(url, newDataOwnerUpdate);
  }

  public modifyDataOwner(dataOwnerId: number, dataOwnerUpdate: IDataOwnerUpdateRequest): Observable<Response> {
    const url = `${this.backendUrl}/${this.baseUrl.admin}/data-owners/${dataOwnerId}`;
    return this.http.put(url, dataOwnerUpdate);
  }

  private generateDataOwnerFilterUrl(filter: IDataOwnerFilter): string {
    let urlParameters = '';
    for (const key of Object.keys(filter)) {
      if (filter.hasOwnProperty(key) && filter[key] !== undefined) {
        const param = filter[key];
        if (isArray(param)) {
          for (const item of param) {
            urlParameters += (urlParameters) ? '&' + key + '=' + encodeURIComponent(item) : key + '=' + encodeURIComponent(item);
          }
        } else {
          urlParameters += (urlParameters) ? '&' + key + '=' + encodeURIComponent(param) : key + '=' + encodeURIComponent(param);
        }
      }
    }
    return !!urlParameters ? '?' + urlParameters : '';
  }

}
