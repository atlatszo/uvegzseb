import { IDataOwnerUpdateRequest } from '../interfaces/data-owner-update-request';
import { isObject } from 'rxjs/util/isObject';

export class DataOwner {

  public id: number;
  public uuid: string;
  public shortName: string;
  public longName: string;
  public emails: Array<string>;
  public description: string;
  public weight: number;
  public detail: {
    lastSuccessfulHarvestDate: string;
    crawlerName: string;
    error: string | null;
  };

  public static generateDataOwnerUpdateRequest(dataOwner: DataOwner): IDataOwnerUpdateRequest {
    return {
      shortName: dataOwner.shortName,
      longName: dataOwner.longName,
      description: dataOwner.description,
      weight: dataOwner.weight,
      emails: dataOwner.emails
    };
  }

  public static getDummyDataOwner(): DataOwner {
    return new DataOwner(-1, '', '', '', [], '', 0, {
      error: null,
      crawlerName: '',
      lastSuccessfulHarvestDate: ''
    });
  }

  constructor(id: number | DataOwner,
              uuid?: string,
              shortName?: string,
              longName?: string,
              emails?: Array<string>,
              description?: string,
              weight?: number,
              detail?: {
                lastSuccessfulHarvestDate: string,
                crawlerName: string,
                error: string | null
              }) {
    if (isObject(id)) {
      this.initWithObject(<DataOwner>id);
    } else {
      this.initWithParams(<number>id, uuid, shortName, longName, emails, description, weight, detail);
    }
  }

  private initWithObject(dataOwner: DataOwner): void {
    this.id = dataOwner.id;
    this.uuid = dataOwner.uuid;
    this.shortName = dataOwner.shortName;
    this.longName = dataOwner.longName;
    this.emails = dataOwner.emails.slice(0);
    this.description = dataOwner.description;
    this.weight = dataOwner.weight;
    this.detail = dataOwner.detail;
  }

  private initWithParams(id: number,
                         uuid: string,
                         shortName: string,
                         longName: string,
                         emails: Array<string>,
                         description: string,
                         weight: number,
                         detail: { lastSuccessfulHarvestDate: string; crawlerName: string; error: (string | any) }): void {
    this.id = id;
    this.uuid = uuid;
    this.shortName = shortName;
    this.longName = longName;
    this.emails = emails.slice(0);
    this.description = description;
    this.weight = weight;
    this.detail = detail;
  }

}
