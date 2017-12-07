import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AboutModule } from './about/about.module';
import { DataOwnersModule } from './data-owners/data-owners.module';
import { HowItWorksModule } from './how-it-works/how-it-works.module';
import { ImpressumModule } from './impressum/impressum.module';
import { LegalNoticeModule } from './legal-notice/legal-notice.module';
import { PublicationsModule } from './publications/publications.module';
import { UnsubscribeModule } from './unsubscribe/unsubscribe.module';

import { ApiService } from './shared/services/api.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    AboutModule,
    DataOwnersModule,
    HowItWorksModule,
    ImpressumModule,
    LegalNoticeModule,
    PublicationsModule,
    UnsubscribeModule
  ],
  exports: [
    CommonModule,
    AboutModule,
    DataOwnersModule,
    HowItWorksModule,
    ImpressumModule,
    LegalNoticeModule,
    PublicationsModule,
    UnsubscribeModule
  ],
  providers: [
    ApiService
  ]
})
export class CoreModule { }
