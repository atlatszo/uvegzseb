import { SubscribeRequest } from './subscribe-request';

export class UnSubscribeRequest extends SubscribeRequest {

  public token: string;

  constructor(email: string, token: string) {
    super(email);
    this.token = token;
  }

}
