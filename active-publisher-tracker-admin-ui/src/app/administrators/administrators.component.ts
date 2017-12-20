import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/services/api.service';
import { Account } from '../shared/classes/account';
import { Role, TRole } from '../shared/classes/role';
import { CustomFormProperties } from '../shared/classes/custom-form-properties';
import { IAccountUpdateRequest } from '../shared/interfaces/account-update-request';
import { IAccountForm } from '../shared/interfaces/account-form';
import { passwordValidator, PasswordValidatorOptions } from '../shared/validators/password-validator.directive';
import { matchOtherValidator } from '../shared/validators/match-other-validator.directive';
import { emailValidator } from '../shared/validators/email-validator.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAccountModalContentComponent } from './delete-account-modal-content/delete-account-modal-content.component';
import { DeleteModalResult, TDeleteModalResult } from '../shared/classes/delete-modal-result';
import * as EmailValidator from 'email-validator';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {

  public translationKey = 'administrators.';
  public accounts: Array<Account> = [];
  public loading: boolean;
  public pending: boolean;
  public errorLoad: boolean;
  public errorAdd: boolean;
  public errorNotUniqueEmail: boolean;
  public errorModify: boolean;
  public errorDelete: boolean;
  public passwordValidatorOptions: PasswordValidatorOptions = {
    minLength: 8,
    maxLength: 255
  };
  public addForm: FormGroup;
  public modifyForm: FormGroup;
  private defaultModifyAccount: Account = Account.getDummyAccount();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private modalService: NgbModal) { }

  ngOnInit() {
    this.initModifyForm(this.defaultModifyAccount);
    this.getAccounts();
  }

  public isAdmin(role: TRole): boolean {
    return Role.isAdmin(role);
  }

  public isLoggedInUser(email: string): boolean {
    return this.apiService.userEmail !== undefined && this.apiService.userEmail === email;
  }

  public initAddForm(): void {
    this.addForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
      passwords: this.formBuilder.group({
        password: ['', [
          Validators.required,
          passwordValidator(this.passwordValidatorOptions)
        ]],
        confirmPassword: ['', [
          Validators.required,
          passwordValidator(this.passwordValidatorOptions),
          matchOtherValidator('password')
        ]]
      }),
      isAdmin: [false]
    });
  }

  public cancelAdd(): void {
    this.addForm = null;
  }

  public addAccount(formValue: IAccountForm): void {
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    const accountUpdate: IAccountUpdateRequest = {
      email: formValue.email,
      password: formValue.passwords.password,
      role: formValue.isAdmin ? Role.ADMIN : Role.CONFIGURATOR
    };
    this.apiService.addAccount(accountUpdate)
      .finally(() => this.pending = false)
      .subscribe(
        () => {
          this.cancelAdd();
          this.errorAdd = false;
          this.getAccounts();
        },
        error => {
          console.error(error);
          this.errorAdd = true;
          this.errorNotUniqueEmail = error.status && error.status === 409;
          this.apiService.setIsLoading(false);
        }
      );
  }

  public isInEdit(account: Account): boolean {
    return this.modifyForm && this.modifyForm.get('id').value === account.id;
  }

  public editAccount(account: Account): void {
    this.initModifyForm(account);
  }

  public isAccountChanged(formValue: IAccountForm): boolean {
    const accountInEdit: Account = this.accounts.find((account: Account) => account.id === formValue.id);
    if (accountInEdit && this.isInEdit(accountInEdit)) {
      return (formValue.email && EmailValidator.validate(formValue.email) && accountInEdit.email !== formValue.email) ||
        Role.isAdmin(accountInEdit.role) !== formValue.isAdmin ||
        Role.isConfigurator(accountInEdit.role) !== !formValue.isAdmin ||
        (CustomFormProperties.isFormValuesEquals(formValue.passwords.password, formValue.passwords.confirmPassword) &&
          CustomFormProperties.isFormValueDefined(formValue.passwords.password) &&
          !CustomFormProperties.isFormValueTooShort(formValue.passwords.password, this.passwordValidatorOptions.minLength) &&
          !CustomFormProperties.isFormValueTooLong(formValue.passwords.password, this.passwordValidatorOptions.maxLength));
    } else {
      return false;
    }
  }

  public modifyAccount(formValue: IAccountForm): void {
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    this.apiService.modifyAccount(formValue.id, this.generateAccountUpdate(formValue))
      .finally(() => {
        this.pending = false;
      })
      .subscribe(
        () => {
          this.cancelEdit();
          this.errorModify = false;
          this.getAccounts();
        },
        error => {
          console.error(error);
          this.errorModify = true;
          this.errorNotUniqueEmail = error.status && error.status === 409;
          this.apiService.setIsLoading(false);
        }
      );
  }

  public cancelEdit(): void {
    this.initModifyForm(this.defaultModifyAccount);
  }

  public initDelete(account: Account): void {
    const modalRef = this.modalService.open(DeleteAccountModalContentComponent);
    modalRef.componentInstance.account = account;
    modalRef.result.then((result: TDeleteModalResult) => {
      if (result === DeleteModalResult.DELETE) {
        this.deleteAccount(account.id);
      }
    });
  }

  public deleteAccount(accountId: number): void {
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    this.apiService.deleteAccount(accountId)
      .finally(() => this.pending = false)
      .subscribe(
        () => {
          this.errorDelete = false;
          this.getAccounts();
        },
        error => {
          console.error(error);
          this.errorDelete = true;
        }
      );
  }

  public closeAlert(alert: string): void {
    if (this[alert] !== undefined) {
      this[alert] = false;
    }
  }

  private initModifyForm(account: Account) {
    const accountInEdit = new Account(account);
    this.modifyForm = this.formBuilder.group({
      id: [accountInEdit.id, [Validators.required]],
      email: [accountInEdit.email, emailValidator()],
      passwords: this.formBuilder.group({
        password: ['', passwordValidator(this.passwordValidatorOptions)],
        confirmPassword: ['', [
          passwordValidator(this.passwordValidatorOptions),
          matchOtherValidator('password')
        ]]
      }),
      isAdmin: [Role.isAdmin(accountInEdit.role)]
    });
  }

  private getAccounts(): void {
    this.loading = true;
    this.apiService.setIsLoading(this.loading);
    this.apiService.getAccounts()
      .finally(() => {
        this.loading = false;
        this.apiService.setIsLoading(this.loading);
      })
      .subscribe(
        (accounts: Array<Account>) => {
          this.accounts = accounts;
          this.errorLoad = false;
        },
        error => {
          console.error(error);
          this.errorLoad = true;
        }
      );
  }

  private generateAccountUpdate(formValue: IAccountForm): IAccountUpdateRequest {
    const accountUpdate: IAccountUpdateRequest = {};
    if (formValue.email) {
      accountUpdate.email = formValue.email;
    }
    if (formValue.passwords.password) {
      accountUpdate.password = formValue.passwords.password;
    }
    if (formValue.isAdmin !== undefined) {
      accountUpdate.role = formValue.isAdmin ? Role.ADMIN : Role.CONFIGURATOR;
    }
    return accountUpdate;
  }

}
