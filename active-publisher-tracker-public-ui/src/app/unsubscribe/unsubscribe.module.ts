import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe.component';
import { UnsubscribeRoutingModule } from './unsubscribe-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    UnsubscribeRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [UnsubscribeComponent]
})
export class UnsubscribeModule { }
