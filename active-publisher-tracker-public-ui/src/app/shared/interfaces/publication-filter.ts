export interface IPublicationFilter {
  start: number;
  rows: number;
  from?: string;
  to?: string;
  dataOwnerNameFragment?: string;
  categoryId?: number[];
}
