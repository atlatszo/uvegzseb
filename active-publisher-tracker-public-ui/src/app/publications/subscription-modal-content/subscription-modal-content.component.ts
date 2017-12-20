import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscribeRequest } from '../../shared/classes/subscribe-request';
import { forbiddenEmailValidator } from './forbidden-email-validator.directive';

@Component({
  selector: 'app-subscription-modal-content',
  templateUrl: './subscription-modal-content.component.html',
  styleUrls: ['./subscription-modal-content.component.scss']
})
export class SubscriptionModalContentComponent implements OnInit {

  public translationKey = 'subscriptionModal.';
  public reCaptchaSiteKey: string;
  public isAcceptedReCaptcha = false;
  public isErrorSubscribe: boolean;
  public emailForm: FormGroup;

  constructor(private http: Http, private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.initReCaptchaSiteKey();
    this.initEmailForm();
  }

  public close(): void {
    this.activeModal.close();
  }

  public subscribe(email): void {
    this.apiService.subscribeEmail(new SubscribeRequest(email)).subscribe(
      () => {
        this.isErrorSubscribe = false;
        this.activeModal.close();
      },
      error => {
        console.error(error);
        this.isErrorSubscribe = true;
      }
    );
  }

  public resolved(captchaResponse: string): void {
    if (captchaResponse) {
      this.isAcceptedReCaptcha = true;
    }
  }

  public closeAlert(): void {
    this.isErrorSubscribe = false;
  }

  private initReCaptchaSiteKey(): void {
    this.http.get('assets/config/config.json')
      .map(config => config.json())
      .subscribe((config: { reCaptcha_site_key: string }) => {
        this.reCaptchaSiteKey = config.reCaptcha_site_key;
      });
  }

  private initEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, forbiddenEmailValidator()]]
    });
  }

}
