import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges {

  @Input() options: Array<{ id: number, value: string }> = [];
  @Input() limit = 10;
  @Input() inputId: string;
  @Input() clearButtonId: string;
  @Input() search: string;
  @Output() selected: EventEmitter<{ id: number, value: string }> = new EventEmitter();
  @Output() open: EventEmitter<boolean> = new EventEmitter();
  public isOpen = false;
  public selectedItem = -1;

  constructor() { }

  ngOnChanges(changes?: SimpleChanges): void {
    this.options = this.options.slice(0);
    this.selectedItem = -1;
    if (this.options && this.options.length &&
      changes['search'] && changes['search'].currentValue &&
      changes['search'].previousValue !== changes['search'].currentValue &&
      this.filterOptions(changes['search'].currentValue).length &&
      this.searchTermIsNotWholeOptionValue(changes['search'].currentValue)
    ) {
      this.openDropDown();
    } else {
      this.closeDropDown();
    }
  }

  public filterOptions(filter: string): Array<{ id: number, value: string }> {
    if (filter) {
      return this.options.filter((option: { id: number, value: string }) => {
        const f = filter.replace(/\s+/g, ' ').toLowerCase();
        const v = option.value.replace(/\s+/g, ' ').toLowerCase();
        return v.indexOf(f) > -1;
      });
    }
    return this.options;
  }

  public onSelect(selected: { id: number, value: string }): void {
    if (selected) {
      this.selected.emit(selected);
      this.closeDropDown();
    }
    this.selectedItem = -1;
  }

  public onClickOutside(): void {
    if (this.options && this.options.length) {
      this.closeDropDown();
    }
  }

  public onClickInInput(): void {
    if (
      this.options && this.options.length &&
      (!this.search || (this.search &&
        this.filterOptions(this.search).length &&
        this.searchTermIsNotWholeOptionValue(this.search)))
    ) {
      this.isOpen ? this.closeDropDown() : this.openDropDown();
    }
  }

  public onEnterTyped(): void {
    if (this.selectedItem > -1) {
      this.onSelect(this.filterOptions(this.search)[this.selectedItem]);
    } else {
      this.closeDropDown();
    }
  }

  public onEscapeTyped(): void {
    this.closeDropDown();
  }

  public onTabTyped(): void {
    this.closeDropDown();
  }

  public onMoveUp(): void {
    if (this.filterOptions(this.search)[this.selectedItem - 1]) {
      --this.selectedItem;
    } else {
      this.selectedItem = this.filterOptions(this.search).length - 1;
    }
  }

  public onMoveDown(): void {
    if (this.filterOptions(this.search)[this.selectedItem + 1]) {
      ++this.selectedItem;
    } else {
      this.selectedItem = 0;
    }
  }

  public onMouseEnter(i: number): void {
    this.selectedItem = i;
  }

  private openDropDown(): void {
    this.isOpen = true;
    this.open.emit(true);
  }

  private closeDropDown(): void {
    this.isOpen = false;
    this.open.emit(false);
    this.selectedItem = -1;
  }

  private searchTermIsNotWholeOptionValue(searchTerm: string) {
    return this.options
      .map((option: { id: number, value: string }) => option.value.replace(/\s+/g, ' ').toLowerCase())
      .indexOf(searchTerm.replace(/\s+/g, ' ').toLowerCase()) === -1;
  }

}
