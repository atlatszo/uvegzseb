import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpressumComponent } from './impressum.component';
import { ImpressumRoutingModule } from './impressum-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ImpressumRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ImpressumComponent]
})
export class ImpressumModule { }
