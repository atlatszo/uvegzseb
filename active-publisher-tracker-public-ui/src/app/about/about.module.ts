import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [AboutComponent]
})
export class AboutModule { }
