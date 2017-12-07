import { Pipe, PipeTransform } from '@angular/core';
import { IMultiSelectOption } from './multi-select.component';

@Pipe({
  name: 'sortSelectOptions'
})
export class SortSelectOptionsPipe implements PipeTransform {

  transform(options: Array<IMultiSelectOption>, multi?: boolean): Array<IMultiSelectOption> {
    if (multi) {
      return options.sort(this.sortByName);
    }
    return options;
  }

  private sortByName(a: IMultiSelectOption, b: IMultiSelectOption) {
    if (a.value > b.value) {
      return 1;
    } else if (a.value < b.value) {
      return -1;
    } else {
      return 0;
    }
  }
}
