import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-tags',
  templateUrl: './input-tags.component.html',
  styleUrls: ['./input-tags.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTagsComponent),
      multi: true
    }
  ]
})
export class InputTagsComponent implements OnChanges, ControlValueAccessor {

  @Input() tags: Array<string> = [];
  @Input() placeholder = 'Type to add';
  @Input() valid: boolean;
  @Input() invalid: boolean;
  public focused: boolean;
  private _input: string;
  private customSeparator = '####';
  private propagateChange = (_: any) => {};
  private propagateTouch = (_: any) => {};

  get input(): string {
    return this._input;
  }

  set input(input: string) {
    this._input = input;
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  writeValue(value: Array<string>): void {
    if (value) {
      this.tags = value;
    } else {
      this.tags = [];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  public addTag(tag: string): void {
    tag = tag.trim();
    if (this.tags.indexOf(tag) === -1) {
      this.tags.push(tag);
      this.propagateChange(this.tags.slice(0));
    }
  }

  public removeTag(tag: string): void {
    const index = this.tags.findIndex(tagEl => tagEl === tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.propagateChange(this.tags.slice(0));
    }
  }

  public removeLastTag(): void {
    if (this.tags && this.tags.length && this.focused && !this.input) {
      this.tags.splice(this.tags.length - 1, 1);
      this.propagateChange(this.tags.slice(0));
    }
  }

  public onFocus(): void {
    this.focused = true;
  }

  public onBlur(): void {
    this.initSeparator();
    this.focused = false;
    this.propagateTouch(true);
  }

  private clearInput(): void {
    this.input = '';
  }

  public initSeparator() {
    if (this.focused && this.input && this.input.trim()) {
      const inputs = this.input
        .replace(/,+/g, this.customSeparator)
        .replace(/\s+/g, this.customSeparator)
        .split(this.customSeparator)
        .map(input => input.trim())
        .filter(input => !!input);

      inputs.forEach(input => {
        this.addTag(input);
      });
      this.clearInput();
    }
  }

}
