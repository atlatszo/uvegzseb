import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { Category } from '../../shared/classes/category';
import { DataOwnerOption } from '../../shared/classes/data-owner';
import { IPublicationFilter } from '../../shared/interfaces/publication-filter';
import { UpdatesResponse } from '../../shared/classes/publication';
import { UpdateHandler } from '../../shared/classes/update-handler';
import { Update } from '../../shared/classes/update';
import * as moment from 'moment-timezone';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  public translationKey = 'dataTable.';
  public dataOwnerOptions: Array<DataOwnerOption> = [];
  public categories: Array<Category> = [];
  public form: FormGroup;
  public updates: Array<UpdateHandler>;
  public start = 0;
  public rows = 20;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getDataOwnerOptions();
    this.getCategories();
    this.initForm();
    this.getPublications(this.generateFilter());
  }

  public getDataOwnerOptions(): void {
    this.apiService.getDataOwnerOptions().subscribe(
      (ownerOptions: Array<DataOwnerOption>) => {
        this.dataOwnerOptions = ownerOptions;
      },
      error => console.error(error)
    );
  }

  public getCategories(): void {
    this.apiService.getCategories().subscribe(
      (categories: Array<Category>) => {
        this.categories = categories;
      },
      error => console.error(error)
    );
  }

  public getPublications(filter: IPublicationFilter): void {
    this.apiService.getPublications(filter).subscribe(
      (updatesResponse: UpdatesResponse) => {
        if (this.updates) {
          this.updates = this.updates.concat(this.initUpdateHandler(updatesResponse.updates));
        } else {
          this.updates = this.initUpdateHandler(updatesResponse.updates);
         }
      },
      error => console.error(error)
    );
  }

  public onScroll(): void {
    this.start += this.rows;
    this.getPublications(this.generateFilter());
  }

  public showDetails(update: UpdateHandler): void {
    update.show = !update.show;
  }

  private initUpdateHandler(updates: Array<Update>): Array<UpdateHandler> {
    const updateHandler: Array<UpdateHandler> = [];
    updates.forEach((update: Update) => {
      updateHandler.push(new UpdateHandler(update, false));
    });
    return updateHandler;
  }

  private initForm(): void {
    const now = moment().utc();
    this.form = this.formBuilder.group({
      dataOwnerName: '',
      dateRange: {
        startDate: now.subtract(1, 'month'),
        endDate: now
      },
      categoryIds: [[]]
    });
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((formValue: any) => {
        this.start = 0;
        this.updates = null;
        this.getPublications(this.generateFilter());
      });
  }

  private generateFilter(): IPublicationFilter {
    const filter: IPublicationFilter = {start: this.start, rows: this.rows};
    const dataOwnerName = this.form.get('dataOwnerName').value;
    const categories = this.form.get('categoryIds').value;
    // TODO: Not needed for first phase
    // const dateRange = this.form.get('dateRange').value;
    // if (dateRange) {
    //   filter.from = moment.utc(moment(dateRange.startDate)).tz(moment.tz.guess()).format().toString();
    //   filter.to = moment.utc(moment(dateRange.endDate)).tz(moment.tz.guess()).format().toString();
    // }
    if (dataOwnerName) {
      filter.dataOwnerNameFragment = dataOwnerName;
    }
    if (categories) {
      filter.categoryId = categories;
    }
    return filter;
  }
}
