import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true
    }
  ]
})
export class CustomCheckboxComponent implements ControlValueAccessor {

  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;
  @Input() displayOnly = false;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();
  private propagateChange = (_: any) => {};

  constructor() { }

  writeValue(value: any): void {
    this.isChecked = value;
    this.propagateChange(this.isChecked);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  public onToggle(): void {
    if (!this.isDisabled && !this.displayOnly) {
      this.isChecked = !this.isChecked;
      this.toggled.emit(this.isChecked);
      this.propagateChange(this.isChecked);
    }
  }

}
