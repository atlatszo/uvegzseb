import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableComponent } from './data-table.component';
import { InputButtonDropdownModule } from './input-button-dropdown/input-button-dropdown.module';
import { DateRangePickerModule } from './date-range-picker/date-range-picker.module';
import { MultiSelectModule } from './multi-select/multi-select.module';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputButtonDropdownModule,
    DateRangePickerModule,
    MultiSelectModule,
    TranslateModule.forChild(),
    InfiniteScrollModule,
    NgbModule
  ],
  declarations: [DataTableComponent],
  exports: [DataTableComponent]
})
export class DataTableModule {}
