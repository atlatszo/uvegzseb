export class PublicationDocument {

  public documentTitle: string;
  public pageUrl: string;
  public providedDate: string;

  constructor(documentTitle: string, pageUrl: string, providedDate: string) {
    this.documentTitle = documentTitle;
    this.pageUrl = pageUrl;
    this.providedDate = providedDate;
  }

}
