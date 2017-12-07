export interface IDataOwnerUpdateRequest {
  shortName: string;
  longName: string;
  weight?: number;
  emails: Array<string>;
  description?: string;
}
