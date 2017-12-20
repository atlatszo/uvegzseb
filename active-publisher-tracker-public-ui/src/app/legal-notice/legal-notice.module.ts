import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalNoticeComponent } from './legal-notice.component';
import { LegalNoticeRoutingModule } from './legal-notice-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LegalNoticeRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [LegalNoticeComponent]
})
export class LegalNoticeModule { }
