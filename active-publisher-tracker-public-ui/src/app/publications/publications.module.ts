import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsComponent } from './publications.component';
import { PublicationsRoutingModule } from './publications-routing.module';
import { DataTableModule } from './data-table/data-table.module';
import { RankTableModule } from './rank-table/rank-table.module';
import { SubscriptionModalContentComponent } from './subscription-modal-content/subscription-modal-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    PublicationsRoutingModule,
    DataTableModule,
    RankTableModule,
    TranslateModule.forChild(),
    RecaptchaModule.forRoot(),
    NgbModule
  ],
  declarations: [
    PublicationsComponent,
    SubscriptionModalContentComponent
  ],
  entryComponents: [
    SubscriptionModalContentComponent
  ]
})
export class PublicationsModule { }
