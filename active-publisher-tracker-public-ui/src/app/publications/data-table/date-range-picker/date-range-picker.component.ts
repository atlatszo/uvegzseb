import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements OnInit, ControlValueAccessor {
  public dateRangeOptions: any = {
    locale: {format: 'YYYY/MM/DD'},
    alwaysShowCalendars: false,
    autoApply: true
  };

  public _dateRange: any = {};

  get dateRange(): any {
    return this._dateRange;
  }

  public setDateRange(v: any) {
    this._dateRange.startDate = v.start;
    this._dateRange.endDate = v.end;
    this.propagateChange(this.dateRange);
  }

  private propagateChange = (_: any) => {};

  constructor() { }

  ngOnInit() { }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.dateRangeOptions.startDate = value.startDate;
      this.dateRangeOptions.endDate = value.endDate;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }
}
