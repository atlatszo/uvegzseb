import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataOwnerOption } from '../shared/classes/data-owner-option';
import { Crawler } from '../shared/classes/crawler';
import { IDataOwnerFilter } from '../shared/interfaces/data-owner-filter';
import { DataOwnerResponse } from '../shared/classes/data-owner-response';
import { DataOwner } from '../shared/classes/data-owner';
import { NoData } from '../shared/classes/no-data';
import { IDataOwnerUpdateRequest } from '../shared/interfaces/data-owner-update-request';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { decimalLengthValidator, decimalValidator } from '../shared/validators/number-validator.directive';
import { emailsValidator } from '../shared/validators/email-validator.directive';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-data-owners',
  templateUrl: './data-owners.component.html',
  styleUrls: ['./data-owners.component.scss']
})
export class DataOwnersComponent implements OnInit, OnDestroy {

  public translationKey = 'data_owners.';
  public dataOwners: Array<DataOwner> = [];
  public dataOwnerOptions: Array<DataOwnerOption> = [];
  public crawlers: Array<Crawler> = [];
  public loading: boolean;
  public pending: boolean;
  public errorLoad: boolean;
  public errorAdd: boolean;
  public errorNotUniqueName: boolean;
  public errorModify: boolean;
  public filterForm: FormGroup;
  public addForm: FormGroup;
  public modifyForm: FormGroup;
  public currentPage: number;
  public start: number;
  public row = 15;
  public totalCount: number;
  public defaultWeightMin = 0;
  public defaultWeightMax = 5;
  public defaultTextInputMaxLength = 255;
  public defaultTextAreaMaxLength = 5000;
  private subscriptions: Array<Subscription> = [];
  private defaultModifyDataOwner: DataOwner = DataOwner.getDummyDataOwner();
  private openDescriptionId: number;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.initPagination();
    this.getDataOwnerOptions();
    this.getCrawlers();
    this.initFilterForm();
    this.initModifyForm(this.defaultModifyDataOwner);
    this.getDataOwners(this.generateFilter());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public onPageChange(page: number): void {
    this.start = (page - 1) * this.row;
    this.getDataOwners(this.generateFilter());
  }

  public getDataOwnerOptions(): void {
    this.apiService.getDataOwnerOptions().subscribe(
      (dataOwnerOptions: Array<DataOwnerOption>) => {
        this.dataOwnerOptions = dataOwnerOptions;
      },
      error => console.error(error)
    );
  }

  public getCrawlers(): void {
    this.apiService.getCrawlers().subscribe(
      (crawlers: Array<Crawler>) => {
        this.crawlers = crawlers;
      },
      error => console.error(error)
    );
  }

  public initAddForm(): void {
    this.addForm = this.formBuilder.group({
      longName: ['', [Validators.required, Validators.maxLength(this.defaultTextInputMaxLength)]],
      shortName: ['', [Validators.maxLength(this.defaultTextInputMaxLength)]],
      emails: [[], [Validators.required, Validators.minLength(1), emailsValidator()]],
      weight: [null, [
        decimalValidator(this.defaultWeightMin, this.defaultWeightMax),
        decimalLengthValidator(1)
      ]],
      description: ['', Validators.maxLength(this.defaultTextAreaMaxLength)]
    });
  }

  public cancelAdd(): void {
    this.addForm = null;
  }

  public addDataOwner(formValue: IDataOwnerUpdateRequest): void {
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    this.apiService.addDataOwner(this.mapWeightValue(formValue))
      .finally(() => this.pending = false)
      .subscribe(
        () => {
          this.cancelAdd();
          this.errorAdd = false;
          this.getDataOwners(this.generateFilter());
          this.getDataOwnerOptions();
        },
        error => {
          console.error(error);
          this.errorAdd = true;
          this.errorNotUniqueName = error.status && error.status === 409;
          this.apiService.setIsLoading(false);
        }
      );
  }

  public editDataOwner(dataOwner: DataOwner): void {
    this.initModifyForm(dataOwner);
  }

  public isInEdit(dataOwner: DataOwner): boolean {
    return this.modifyForm && this.modifyForm.get('id').value === dataOwner.id;
  }

  public isDataOwnerChanged(formValue: DataOwner): boolean {
    const dataOwnerInEdit: DataOwner = this.dataOwners.find((dataOwner: DataOwner) => dataOwner.id === formValue.id);
    if (this.isInEdit(dataOwnerInEdit)) {
      return dataOwnerInEdit.shortName !== formValue.shortName ||
        dataOwnerInEdit.longName !== formValue.longName ||
        !this.arraysEqual(dataOwnerInEdit.emails, formValue.emails) ||
        dataOwnerInEdit.weight !== formValue.weight ||
        dataOwnerInEdit.description !== formValue.description;
    } else {
      return false;
    }
  }

  public modifyDataOwner(formValue: DataOwner) {
    this.pending = true;
    this.apiService.setIsLoading(this.pending);
    this.apiService.modifyDataOwner(formValue.id, this.mapWeightValue(DataOwner.generateDataOwnerUpdateRequest(formValue)))
      .finally(() => this.pending = false)
      .subscribe(
        () => {
          this.cancelEdit();
          this.errorModify = false;
          this.getDataOwners(this.generateFilter());
          this.getDataOwnerOptions();
        },
        error => {
          console.error(error);
          this.errorModify = true;
          this.errorNotUniqueName = error.status && error.status === 409;
          this.apiService.setIsLoading(false);
        }
      );
  }

  public cancelEdit(): void {
    this.initModifyForm(this.defaultModifyDataOwner);
  }

  public closeAlert(alert: string): void {
    if (this[alert] !== undefined) {
      this[alert] = false;
    }
  }

  public openDescription(id: number): void {
    this.openDescriptionId = this.isOpenDescription(id) ? null : id;
  }

  public isOpenDescription(id: number): boolean {
    return this.openDescriptionId === id;
  }

  private initModifyForm(dataOwner: DataOwner) {
    const dataOwnerInEdit = new DataOwner(dataOwner);
    this.modifyForm = this.formBuilder.group({
      id: [dataOwnerInEdit.id, [Validators.required]],
      uuid: [dataOwnerInEdit.uuid, [Validators.required]],
      detail: [dataOwnerInEdit.detail],
      longName: [dataOwnerInEdit.longName, [Validators.required, Validators.maxLength(this.defaultTextInputMaxLength)]],
      shortName: [dataOwnerInEdit.shortName, [Validators.maxLength(this.defaultTextInputMaxLength)]],
      emails: [dataOwnerInEdit.emails, [Validators.required, Validators.minLength(1), emailsValidator()]],
      weight: [dataOwnerInEdit.weight, [
        decimalValidator(this.defaultWeightMin, this.defaultWeightMax),
        decimalLengthValidator(1)
      ]],
      description: [dataOwnerInEdit.description, Validators.maxLength(this.defaultTextAreaMaxLength)]
    });
  }

  private initFilterForm(): void {
    this.filterForm = this.formBuilder.group({
      dataOwnerName: [''],
      crawlerUserId: [null],
      isNoData: [false]
    });
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges() {
    this.subscriptions.push(this.filterForm.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(() => {
        this.initPagination();
        this.getDataOwners(this.generateFilter());
      }));
  }

  private getDataOwners(filter: IDataOwnerFilter) {
    this.loading = true;
    this.apiService.setIsLoading(this.loading);
    this.apiService.getDataOwners(filter)
      .finally(() => {
        this.loading = false;
        this.apiService.setIsLoading(this.loading);
      })
      .subscribe(
        (dataOwnerResponse: DataOwnerResponse) => {
          this.dataOwners = dataOwnerResponse.dataOwners;
          this.totalCount = dataOwnerResponse.totalCount;
          this.errorLoad = false;
        },
        error => {
          console.error(error);
          this.errorLoad = true;
        }
      );
  }

  private generateFilter(): IDataOwnerFilter {
    const dataOwnerName = this.filterForm.get('dataOwnerName').value;
    const crawlerId = this.filterForm.get('crawlerUserId').value;
    const isNoData = this.filterForm.get('isNoData').value;
    const filter: IDataOwnerFilter = {start: this.start, rows: this.row};
    if (dataOwnerName) {
      filter.nameFragment = dataOwnerName;
    }
    if (crawlerId) {
      filter.crawlerUserId = crawlerId;
    }
    if (isNoData) {
      filter.error = NoData.ANY;
    }
    return filter;
  }

  private arraysEqual(arr1: any, arr2: any): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  private initPagination(): void {
    this.start = 0;
    this.currentPage = 1;
  }

  private mapWeightValue(formValue: IDataOwnerUpdateRequest): IDataOwnerUpdateRequest {
    const weight: string = '' + formValue.weight;
    if (weight.indexOf(',') > -1) {
      formValue.weight = +weight.replace(',', '.');
      return formValue;
    } else if (weight.indexOf('.') > -1) {
      formValue.weight = +weight;
      return formValue;
    }
    return formValue;
  }

}
