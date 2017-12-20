import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UnSubscribeRequest } from '../shared/classes/un-subscribe-request';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit {

  public translationKey = 'unsubscribe.';
  public isUnSubscribed = false;
  public isError = false;
  private uuid: string;
  private email: string;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.readQueryParams();
    this.unSubscribeEmail();
  }

  private readQueryParams(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.email = this.route.snapshot.params['email'];
  }

  private unSubscribeEmail(): void {
    if (this.uuid && this.email) {
      this.apiService.unSubscribeEmail(new UnSubscribeRequest(this.email, this.uuid)).subscribe(
        () => {
          this.isUnSubscribed = true;
        },
        error => {
          this.isError = true;
          console.error(error);
        }
      );
    } else {
      this.isError = true;
    }
  }
}
