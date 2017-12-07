export class CustomFormProperties {

  public static isFormValueDefined(formValue: string): boolean {
    return formValue && !!formValue.length;
  }

  public static isFormValueTooLong(formValue: string, max: number): boolean {
    return this.isFormValueDefined(formValue) && formValue.length > max;
  }

  public static isFormValueTooShort(formValue: string, min: number): boolean {
    return this.isFormValueDefined(formValue) && formValue.length < min;
  }

  public static isFormValuesEquals(formValue1: string, formValue2: string): boolean {
    return (!this.isFormValueDefined(formValue1) && !this.isFormValueDefined(formValue2)) ||
      (this.isFormValueDefined(formValue1) && this.isFormValueDefined(formValue2) && formValue1 === formValue2);
  }

}
