import { AbstractControl, ValidatorFn } from '@angular/forms';

export function decimalValidator(min?: number, max?: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const num: string = control.value;
    const rangeDefinedRegexArray: Array<string> = [
      `(?:^(?:\\.\\d{1})$)`,
      `(?:^(?:[${min}-${max - 1}]{1}\\.\\d{1})$)`,
      `(?:^(?:[${min}-${max}]{1}\\.)$)`,
      `(?:^(?:[${max}]\\.[0])$)`,
      `(?:^(?:\\,\\d{1})$)`,
      `(?:^(?:[${min}-${max - 1}]{1}\\,\\d{1})$)`,
      `(?:^(?:[${min}-${max}]{1}\\,)$)`,
      `(?:^(?:[${max}]\\,[0])$)`,
      `(?:^(?:[${min}-${max}]{1})$)`
    ];
    const rangeNotDefinedRegexArray: Array<string> = [
      '(?:^(?:\\.\\d{1,})$)',
      '(?:^(?:\\d{1}\\.\\d{1,})$)',
      '(?:^(?:\\d{1}\\.)$)',
      '(?:^(?:\\,\\d{1,})$)',
      '(?:^(?:\\d{1}\\,\\d{1,})$)',
      '(?:^(?:\\d{1}\\,)$)',
      '(?:^(?:\\d{1})$)'
    ];
    const pattern = min === undefined || max === undefined ?
      new RegExp(rangeNotDefinedRegexArray.join('|')) :
      new RegExp(rangeDefinedRegexArray.join('|'));
    if (!pattern.test(num)) {
      return {
        forbiddenDecimalPattern: true
      };
    }
    return null;
  };
}

export function decimalLengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (length < 0) {
      throw new Error('decimalLengthValidator: Passed length must be bigger than -1.');
    }
    if (!control.value) {
      return null;
    }
    const num: string = '' + control.value;
    if ((num.indexOf(',') > -1)) {
      const decimalLength: number = num.split(',')[1].length;
      if (decimalLength > length) {
        return {
          forbiddenDecimalLength: true
        };
      }
    } else if ((num.indexOf('.') > -1)) {
      const decimalLength: number = num.split('.')[1].length;
      if (decimalLength > length) {
        return {
          forbiddenDecimalLength: true
        };
      }
    }
    return null;
  };
}
