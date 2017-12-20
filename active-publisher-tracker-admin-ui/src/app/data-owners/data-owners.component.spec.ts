import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DataOwnersComponent } from './data-owners.component';
import { MultiSelectModule } from './multi-select/multi-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputButtonDropdownModule } from './input-button-dropdown/input-button-dropdown.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../shared/services/api.service';
import { CustomCheckboxModule } from '../shared/components/custom-checkbox/custom-checkbox.module';
import { DataOwnerOption } from '../shared/classes/data-owner-option';
import { Crawler } from '../shared/classes/crawler';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { InputTagsModule } from './input-tags/input-tags.module';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TruncateModule } from '../shared/pipes/truncate/truncate.module';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('DataOwnersComponent', () => {
  let component: DataOwnersComponent;
  let fixture: ComponentFixture<DataOwnersComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        InputButtonDropdownModule,
        MultiSelectModule,
        CustomCheckboxModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        NgbModule.forRoot(),
        InputTagsModule,
        TruncateModule
      ],
      declarations: [DataOwnersComponent],
      providers: [
        ApiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initialization functions', () => {
      const subscribeToFormChanges = spyOn<any>(component, 'subscribeToFormChanges').and.returnValue(null);
      const getDataOwners = spyOn(component, 'getDataOwnerOptions').and.returnValue(null);
      const getCrawlers = spyOn(component, 'getCrawlers').and.returnValue(null);
      const initForm = spyOn<any>(component, 'initFilterForm').and.callThrough();
      component.ngOnInit();
      expect(getDataOwners).toHaveBeenCalled();
      expect(getCrawlers).toHaveBeenCalled();
      expect(initForm).toHaveBeenCalled();
      expect(subscribeToFormChanges).toHaveBeenCalled();
    });
  });

  describe('initFilterForm', () => {
    it('should initialize filterForm with default values', () => {
      component['initFilterForm']();
      expect(component.filterForm.get('dataOwnerName').value).toEqual('');
      expect(component.filterForm.get('crawlerUserId').value).toEqual(null);
      expect(component.filterForm.get('isNoData').value).toEqual(false);
    });
  });

  describe('getDataOwnerOptions', () => {
    it('should call apiService function getDataOwnerOptions and set dataOwnerOptions with returned data',
      inject([ApiService], (apiService: ApiService) => {
        const mockDataOwners: Array<DataOwnerOption> = [{id: 1, value: 'mockOption'}];
        const mockResponse = Observable.of(mockDataOwners);
        const apiGetDataOwners = spyOn(apiService, 'getDataOwnerOptions').and.returnValue(mockResponse);
        component.getDataOwnerOptions();
        expect(component.dataOwnerOptions).toEqual(mockDataOwners);
        expect(apiGetDataOwners).toHaveBeenCalled();
      })
    );
    it('should call apiService function getDataOwnerOptions and write error on console if returns error',
      inject([ApiService], (apiService: ApiService) => {
        const mockError = new Error('mock server error');
        const mockResponse = Observable.create(observer => { observer.error(mockError); });
        const apiGetDataOwners = spyOn(apiService, 'getDataOwnerOptions').and.returnValue(mockResponse);
        const error = spyOn(console, 'error').and.callFake(() => {});
        component.getDataOwnerOptions();
        expect(apiGetDataOwners).toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(mockError);
      })
    );
  });

  describe('getCrawlers', () => {
    it('should call apiService function getCrawlers and set crawlers with returned data',
      inject([ApiService], (apiService: ApiService) => {
        const mockCrawlers: Array<Crawler> = [{id: 1, value: 'mockCrawler'}];
        const mockResponse = Observable.of(mockCrawlers);
        const apiGetCrawlers = spyOn(apiService, 'getCrawlers').and.returnValue(mockResponse);
        component.getCrawlers();
        expect(component.crawlers).toEqual(mockCrawlers);
        expect(apiGetCrawlers).toHaveBeenCalled();
      })
    );
    it('should call apiService function getCrawlers and write error on console if returns error',
      inject([ApiService], (apiService: ApiService) => {
        const mockError = new Error('mock server error');
        const mockResponse = Observable.create(observer => { observer.error(mockError); });
        const apiGetCrawlers = spyOn(apiService, 'getCrawlers').and.returnValue(mockResponse);
        const error = spyOn(console, 'error').and.callFake(() => {});
        component.getCrawlers();
        expect(apiGetCrawlers).toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith(mockError);
      })
    );
  });

});
