import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RankedDataResponse } from '../classes/ranked-data-response';
import { IPublicationFilter } from '../interfaces/publication-filter';
import { UpdatesResponse } from '../classes/publication';
import { SubscribeRequest } from '../classes/subscribe-request';
import { isArray } from 'rxjs/util/isArray';
import { DataOwnerOption } from '../classes/data-owner';
import { Category } from '../classes/category';
import { UnSubscribeRequest } from '../classes/un-subscribe-request';
import 'rxjs/add/observable/of';

@Injectable()
export class ApiService {

  private _backendUrl = 'active-publisher-tracker-backend';

  private publicUrl = '/public';

  constructor(private http: Http) { }

  get backendUrl(): string {
    return this._backendUrl + this.publicUrl;
  }

  public getRankedData(start: number, rows: number): Observable<RankedDataResponse> {
    const url = `${this.backendUrl}/ranking?start=${start}&rows=${rows}`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  public subscribeEmail(subscribeRequest: SubscribeRequest): Observable<Response> {
    const url = `${this.backendUrl}/subscribers`;
    return this.http.post(url, subscribeRequest);
  }

  public unSubscribeEmail(unSubscribeRequest: UnSubscribeRequest): Observable<Response> {
    const url = `${this.backendUrl}/subscribers`;
    return this.http.delete(url, new RequestOptions({body: unSubscribeRequest}));
  }

  public getDataOwnerOptions(): Observable<Array<DataOwnerOption>> {
    const url = `${this.backendUrl}/data-owners`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  public getCategories(): Observable<Category[]> {
    const url = `${this.backendUrl}/categories`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  public getPublications(filter: IPublicationFilter): Observable<UpdatesResponse> {
    const url = `${this.backendUrl}/updates${this.generatePublicationFilterUrl(filter)}`;
    return this.http.get(url).map((response: Response) => response.json());
  }

  private generatePublicationFilterUrl(filter: IPublicationFilter): string {
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
    return (urlParameters) ? '?' + urlParameters : '';
  }

}
