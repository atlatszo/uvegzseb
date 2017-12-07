import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker.component';
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  imports: [
    CommonModule,
    Daterangepicker
  ],
  declarations: [DateRangePickerComponent],
  exports: [DateRangePickerComponent]
})
export class DateRangePickerModule { }
