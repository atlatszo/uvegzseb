import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankTableComponent } from './rank-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    TranslateModule.forChild(),
    NgbModule
  ],
  declarations: [
    RankTableComponent
  ],
  exports: [RankTableComponent]
})
export class RankTableModule { }
