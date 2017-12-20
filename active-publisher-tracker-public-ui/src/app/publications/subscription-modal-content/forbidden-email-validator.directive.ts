import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as EmailValidator from 'email-validator';

export function forbiddenEmailValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const email: string = control.value;
    const forbidden = !EmailValidator.validate(email);
    return forbidden ? {'forbiddenEmail': {value: control.value}} : null;
  };
}
