import { Update } from './update';

export class UpdatesResponse {

  public totalCount: number;
  public updates: Array<Update>;

  constructor(totalCount: number, updates: Array<Update>) {
    this.totalCount = totalCount;
    this.updates = updates;
  }

}
