import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number): string {
    if (!value) {
      return value;
    }
    const words = value.split(' ');
    const trail = '...';
    if (value) {
      return limit < words.length ? words.slice(0, limit).join(' ') + trail : value;
    }
  }

}
