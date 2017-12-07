import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IMultiSelectOption {
  id: any;
  value: string;
  selected?: boolean;
}

@Component({
  selector: 'app-multi-select',
  templateUrl: 'multi-select.component.html',
  styleUrls: ['multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() options: IMultiSelectOption[] = [];
  @Input() defaultOption = '';
  @Input() open = false;
  @Input() multi = false;
  @Input() placeholder = 'Select';
  @Input() isDisabled = false;
  @Input() allowClear = true;
  @Output() optionsChanged: EventEmitter<string[] | string> = new EventEmitter();
  public optionsRef: IMultiSelectOption[] = [];
  private singleSelected: IMultiSelectOption;
  private disabledRef: boolean;
  private propagateChange = (_: any) => { };

  ngOnInit(): void { }

  ngOnChanges(changes?: SimpleChanges): void {
    if (
      (this.multi && this.options.length && this.isOptionsDifferent()) ||
      (!this.multi && this.options.length && !this.optionsRef.length && this.isOptionsDifferent())
    ) {
      this.initOptions(this.options);
    }
    if (this.disabledRef !== this.isDisabled) {
      this.disabledRef = this.isDisabled === true;
    }
    if (!this.isDisabled) {
      this.isDisabled = !this.optionsRef.length;
    }
  }

  writeValue(value: any): void { }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  public onBtnClick(): void {
    this.open = !this.open;
  }

  public hideMenu(): void {
    this.open = false;
  }

  public onMenuItemClick(event: MouseEvent, option: IMultiSelectOption): void {

    if (this.multi) {
      // prevents menu closing on blur
      event.preventDefault();
    } else {
      this.hideMenu();
    }

    if (this.multi) {
      this.optionsRef[this.optionsRef.indexOf(option)].selected = !this.optionsRef[this.optionsRef.indexOf(option)].selected;
      this.optionsRef = this.optionsRef.slice(0);
      this.emitSelected();
    } else {
      if (this.singleSelected && this.singleSelected.id === option.id) {
        return;
      }
      this.singleSelected = option;
      this.optionsRef.forEach(o => {
        o.selected = o === option;
      });
      this.emitSelected();
    }
  }

  public getPlaceholder(): string {
    if (this.multi) {
      const checkedOptions = this.optionsRef.filter((option) => {
        return option.selected === true;
      }).length;
      return checkedOptions ? checkedOptions + ' Selected' : this.placeholder;
    } else {
      return this.singleSelected ? this.singleSelected.value : this.placeholder;
    }
  }

  public isSelected(): boolean {
    if (this.multi) {
      const filteredOptions: string[] = [];
      this.optionsRef.forEach(option => {
        if (option.selected) {
          filteredOptions.push(option.id);
        }
      });
      return !!filteredOptions && !!filteredOptions.length;
    } else {
      return !!this.singleSelected;
    }
  }

  public onClearClick(): void {
    if (this.multi) {
      this.optionsRef.forEach(option => {
        option.selected = false;
      });
    } else {
      this.singleSelected = null;
    }
    this.emitSelected();
  }

  private initOptions(options: IMultiSelectOption[]): void {
    if (options) {
      const isEmptyOptionsRef = !this.optionsRef.length;
      this.optionsRef = [];
      options.forEach(o => {
        const option: IMultiSelectOption = {
          id: o.id,
          value: o.value,
          selected: this.defaultOption === o.id && this.defaultOption !== ''
        };
        this.optionsRef.push(option);
      });
      if (!isEmptyOptionsRef) {
        this.emitSelected();
      }
    }
  }

  private emitSelected() {
    if (this.multi) {
      const filteredOptions: string[] = [];
      this.optionsRef.forEach(option => {
        if (option.selected) {
          filteredOptions.push(option.id);
        }
      });
      this.optionsChanged.emit(filteredOptions);
      this.propagateChange(filteredOptions);
    } else {
      if (this.singleSelected) {
        this.optionsChanged.emit(this.singleSelected.id);
        this.propagateChange(this.singleSelected.id);
      } else {
        this.optionsChanged.emit(null);
        this.propagateChange(null);
      }
    }
  }

  private isOptionsDifferent(): boolean {
    const newOptions: IMultiSelectOption[] = [];
    this.options.forEach(o => {
      const option: IMultiSelectOption = {
        id: o.id,
        value: o.value,
        selected: this.defaultOption === o.id && this.defaultOption !== ''
      };
      newOptions.push(option);
    });
    if (newOptions.length !== this.optionsRef.length) {
      return true;
    } else {
      for (let i = 0; i < newOptions.length; i++) {
        if (
          newOptions[i].id !== this.optionsRef[i].id ||
          newOptions[i].value !== this.optionsRef[i].value ||
          newOptions[i].selected !== this.optionsRef[i].selected
        ) {
          return true;
        }
      }
      return false;
    }
  }
}
