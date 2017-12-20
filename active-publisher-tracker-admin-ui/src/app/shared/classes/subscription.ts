export class Subscription {

  public id: number;
  public email: string;
  public subscriptionDate: string;

  constructor(id: number, email: string, subscriptionDate: string) {
    this.id = id;
    this.email = email;
    this.subscriptionDate = subscriptionDate;
  }

}
