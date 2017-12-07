import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchOtherValidator(otherControlName: string): ValidatorFn {
  let thisControl;
  let otherControl;
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.parent) {
      return null;
    }
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName);
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }
    if (!otherControl) {
      return null;
    }
    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }
    return null;
  };
}
