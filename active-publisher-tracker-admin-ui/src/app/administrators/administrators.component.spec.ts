import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { AdministratorsComponent } from './administrators.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCheckboxModule } from '../shared/components/custom-checkbox/custom-checkbox.module';
import { ApiService } from '../shared/services/api.service';
import { Account } from '../shared/classes/account';
import { Role } from '../shared/classes/role';
import { IAccountForm } from '../shared/interfaces/account-form';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('AdministratorsComponent', () => {
  let component: AdministratorsComponent;
  let fixture: ComponentFixture<AdministratorsComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        NgbModule.forRoot(),
        CustomCheckboxModule
      ],
      declarations: [
        AdministratorsComponent
      ],
      providers: [
        ApiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should call getAccounts method', () => {
      const getAdministrators = spyOn<any>(component, 'getAccounts');
      component.ngOnInit();
      expect(getAdministrators).toHaveBeenCalled();
    });
  });

  describe('closeAlert', () => {

    it('should set passed variable to false', () => {
      const mockError = 'errorLoad';
      component.errorLoad = true;
      component.closeAlert(mockError);
      expect(component.errorLoad).toBeFalsy();
    });
  });

  describe('deleteAccount', () => {

    it('should call deleteAccount in ApiService and do operations on success', inject([ApiService], (apiService: ApiService) => {
      const mockResult = {};
      const getAdministrators = spyOn<any>(component, 'getAccounts').and.returnValue(null);
      const apiDeleteAccount = spyOn(apiService, 'deleteAccount').and.returnValue(Observable.of(mockResult));
      const mockAccountId = 5;
      component.deleteAccount(mockAccountId);
      expect(apiDeleteAccount).toHaveBeenCalledWith(mockAccountId);
      expect(component.errorDelete).toBeFalsy();
      expect(getAdministrators).toHaveBeenCalled();
    }));
  });

  describe('getAccounts', () => {

    it('should call getAccounts in ApiService and do operations on success', inject([ApiService], (apiService: ApiService) => {
      const mockResult = [
        new Account(1, 'a-admin@mail.com', '2017-09-09Z11:11:12', Role.ADMIN)
      ];
      const apiGetAdministrators = spyOn(apiService, 'getAccounts').and.returnValue(Observable.of(mockResult));
      component['getAccounts']();
      expect(apiGetAdministrators).toHaveBeenCalled();
      expect(component.accounts).toEqual(mockResult);
      expect(component.errorLoad).toBeFalsy();
    }));
  });

});
