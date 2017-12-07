import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { DataOwnersModule } from './data-owners/data-owners.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UnauthorizedModule } from './unauthorized/unauthorized.module';

import { ApiService } from './shared/services/api.service';
import { AdminGuard } from './shared/guards/admin.guard';
import { UnauthorizedGuard } from './shared/guards/unauthorized.guard';

@NgModule({
  imports: [
    CommonModule,
    AdministratorsModule,
    DataOwnersModule,
    SubscriptionsModule,
    UnauthorizedModule
  ],
  exports: [
    CommonModule,
    AdministratorsModule,
    DataOwnersModule,
    SubscriptionsModule,
    UnauthorizedModule
  ],
  providers: [
    ApiService,
    AdminGuard,
    UnauthorizedGuard
  ]
})
export class CoreModule {}
