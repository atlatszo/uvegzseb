import { Component, OnInit } from '@angular/core';
import { Subscription } from '../shared/classes/subscription';
import { ApiService } from '../shared/services/api.service';
import { SubscriptionsResponse } from '../shared/classes/subscriptions-response';
import { DeleteModalResult, TDeleteModalResult } from '../shared/classes/delete-modal-result';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSubscriptionModalContentComponent } from './delete-subscription-modal-content/delete-subscription-modal-content.component';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  public translationKey = 'subscriptions.';
  public subscriptions: Array<Subscription> = [];
  public loading: boolean;
  public pending: boolean;
  public totalCount: number;
  public row = 5;
  public currentPage = 1;
  public errorLoad: boolean;
  public errorDelete: boolean;
  private start = 0;
  private subscriptionToDelete: number;

  constructor(private apiService: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getSubscriptions();
  }

  public onPageChange(page: number): void {
    this.start = (page - 1) * this.row;
    this.getSubscriptions();
  }

  public isSubscriptionToDelete(subscriptionId: number): boolean {
    return this.subscriptionToDelete && this.subscriptionToDelete === subscriptionId;
  }

  public initDeleteSubscription(subscription: Subscription): void {
    const modalRef = this.modalService.open(DeleteSubscriptionModalContentComponent);
    modalRef.componentInstance.subscription = subscription;
    modalRef.result.then((result: TDeleteModalResult) => {
      if (result === DeleteModalResult.DELETE) {
        this.deleteSubscription(subscription.id);
      }
    });
  }

  public deleteSubscription(subscriptionId: number): void {
    this.subscriptionToDelete = subscriptionId;
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    this.apiService.deleteSubscription(subscriptionId)
      .finally(() => {
        this.pending = false;
        this.subscriptionToDelete = null;
      })
      .subscribe(
        () => {
          this.errorDelete = false;
          this.getSubscriptions();
        },
        error => {
          console.error(error);
          this.errorDelete = true;
        }
      );
  }

  public closeAlert(alert: string): void {
    if (this[alert] !== undefined) {
      this[alert] = false;
    }
  }

  private getSubscriptions(): void {
    this.loading = true;
    this.apiService.setIsLoading(this.loading);
    this.apiService.getSubscriptions(this.start, this.row)
      .finally(() => {
        this.loading = false;
        this.apiService.setIsLoading(this.loading);
      })
      .subscribe(
        (subscriptionsResponse: SubscriptionsResponse) => {
          this.totalCount = subscriptionsResponse.totalCount;
          this.subscriptions = subscriptionsResponse.subscriptions;
          this.errorLoad = false;
        },
        error => {
          console.error(error);
          this.errorLoad = true;
        }
      );
  }

}
