import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownFilter'
})
export class DropdownFilterPipe implements PipeTransform {

  transform(options: Array<{ id: number, value: string }>, filter?: string): Array<{ id: number, value: string }> {
    if (filter) {
      return options.filter((option: { id: number, value: string }) => {
        const f = filter.replace(/\s+/g, ' ').toLowerCase();
        const v = option.value.replace(/\s+/g, ' ').toLowerCase();
        return v.indexOf(f) > -1;
      });
    }
    return options;
  }

}
