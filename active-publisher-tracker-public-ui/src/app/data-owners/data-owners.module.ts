import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataOwnersComponent } from './data-owners.component';
import { DataOwnersRoutingModule } from './data-owners-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DataOwnersRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [DataOwnersComponent]
})
export class DataOwnersModule { }
