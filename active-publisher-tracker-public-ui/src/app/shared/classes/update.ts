import { PublicationDocument } from './publication-document';

export class Update {

  public dataOwnerName: string;
  public updateDate: string;
  public categoryName: string;
  public details: Array<PublicationDocument>;

  constructor(dataOwnerName: string, updateDate: string, categoryName: string, details: Array<PublicationDocument>) {
    this.dataOwnerName = dataOwnerName;
    this.updateDate = updateDate;
    this.categoryName = categoryName;
    this.details = details;
  }

}
