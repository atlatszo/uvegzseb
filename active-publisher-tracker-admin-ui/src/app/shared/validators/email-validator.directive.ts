import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as EmailValidator from 'email-validator';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const email: string = control.value;
    if (!EmailValidator.validate(email)) {
      return {
        forbiddenEmail: true
      };
    }
    return null;
  };
}

export function emailsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const emails: Array<string> = control.value;
    for (const email of emails) {
      if (!EmailValidator.validate(email)) {
        return {
          forbiddenEmail: true
        };
      }
    }
    return null;
  };
}
