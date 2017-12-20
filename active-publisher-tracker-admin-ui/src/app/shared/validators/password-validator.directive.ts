import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface PasswordValidatorOptions {
    minLength?: number;
    maxLength?: number;
    requireLetters?: boolean;
    requireLowerCaseLetters?: boolean;
    requireUpperCaseLetters?: boolean;
    requireNumbers?: boolean;
    requireSpecialCharacters?: boolean;
}

export function passwordValidator(options: PasswordValidatorOptions): ValidatorFn {
    const letterMatcher = /[a-zA-Z]/;
    const lowerCaseLetterMatcher = /[a-z]/;
    const upperCaseLetterMatcher = /[A-Z]/;
    const numberMatcher = /[0-9]/;
    const specialCharactersMatcher = /[-+=_.,:;~`!@#$%^&*(){}<>\[\]"'\/\\]/;
    return (control: AbstractControl): { [key: string]: any } => {
        const value = control.value;
        if (!value) {
            return null;
        }
        const errors = {};
        if (options.minLength > 0 && value.length < options.minLength) {
            errors['passwordMinLengthRequired'] = {
                minLength: options.minLength
            };
        }
        if (options.maxLength >= 0 && value.length > options.maxLength) {
            errors['passwordMaxLengthExceeded'] = {
                maxLength: options.maxLength
            };
        }
        if (options.requireLetters && !letterMatcher.test(value)) {
            errors['passwordLetterRequired'] = true;
        }
        if (options.requireLowerCaseLetters && !lowerCaseLetterMatcher.test(value)) {
            errors['passwordLowerCaseLetterRequired'] = true;
        }
        if (options.requireUpperCaseLetters && !upperCaseLetterMatcher.test(value)) {
            errors['passwordUpperCaseLetterRequired'] = true;
        }
        if (options.requireNumbers && !numberMatcher.test(value)) {
            errors['passwordNumberRequired'] = true;
        }
        if (options.requireSpecialCharacters && !specialCharactersMatcher.test(value)) {
            errors['passwordSpecialCharacterRequired'] = true;
        }
        return Object.keys(errors).length > 0 ? errors : null;
    };
}
