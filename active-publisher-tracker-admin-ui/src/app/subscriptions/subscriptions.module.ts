import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';
import { SubscriptionsRoutingModule } from './subscriptions-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSubscriptionModalContentComponent } from './delete-subscription-modal-content/delete-subscription-modal-content.component';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionsRoutingModule,
    TranslateModule.forChild(),
    NgbModule
  ],
  declarations: [
    SubscriptionsComponent,
    DeleteSubscriptionModalContentComponent
  ],
  entryComponents: [
    DeleteSubscriptionModalContentComponent
  ]
})
export class SubscriptionsModule {}
