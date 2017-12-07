import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowItWorksComponent } from './how-it-works.component';
import { HowItWorksRoutingModule } from './how-it-works-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HowItWorksRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [HowItWorksComponent]
})
export class HowItWorksModule { }
