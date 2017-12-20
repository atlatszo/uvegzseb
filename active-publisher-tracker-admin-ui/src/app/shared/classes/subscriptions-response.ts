import { Subscription } from './subscription';

export class SubscriptionsResponse {

  public totalCount: number;
  public subscriptions: Array<Subscription>;

  constructor(totalCount: number, subscriptions: Array<Subscription>) {
    this.totalCount = totalCount;
    this.subscriptions = subscriptions;
  }

}
