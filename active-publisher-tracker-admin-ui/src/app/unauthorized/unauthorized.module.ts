import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized.component';
import { UnauthorizedRoutingModule } from './unauthorized-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    UnauthorizedRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [UnauthorizedComponent]
})
export class UnauthorizedModule {}
