import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { SubscriptionsComponent } from './subscriptions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../shared/services/api.service';
import 'rxjs/add/observable/of';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        NgbModule.forRoot()
      ],
      declarations: [SubscriptionsComponent],
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
    fixture = TestBed.createComponent(SubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getSubscriptions', () => {
      const getSubscriptions = spyOn<any>(component, 'getSubscriptions').and.returnValue(null);
      component.ngOnInit();
      expect(getSubscriptions).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should set start and call getSubscriptions', () => {
      const getSubscriptions = spyOn<any>(component, 'getSubscriptions').and.returnValue(null);
      let mockPage = 2;
      component.row = 1;
      component.onPageChange(mockPage);
      expect(getSubscriptions).toHaveBeenCalled();
      expect(component['start']).toBe(1);
      mockPage = 5;
      component.onPageChange(mockPage);
      expect(getSubscriptions).toHaveBeenCalled();
      expect(component['start']).toBe(4);
    });
  });

  describe('isSubscriptionToDelete', () => {
    it('should return false if subscriberToDelete is undefined', () => {
      expect(component.isSubscriptionToDelete(2)).toBeFalsy();
    });
    it('should return false if subscriberToDelete and passed id doesn\'t match', () => {
      component['subscriptionToDelete'] = 3;
      expect(component.isSubscriptionToDelete(2)).toBeFalsy();
    });
    it('should return true if subscriberToDelete and passed id match', () => {
      component['subscriptionToDelete'] = 3;
      expect(component.isSubscriptionToDelete(3)).toBeTruthy();
    });
  });

  describe('deleteSubscription', () => {
    it('should call deleteSubscription in ApiService and do operations on success', inject([ApiService], (apiService: ApiService) => {
      const mockResult = {};
      const getSubscriptions = spyOn<any>(component, 'getSubscriptions').and.returnValue(null);
      const apiDeleteSubscription = spyOn(apiService, 'deleteSubscription').and.returnValue(Observable.of(mockResult));
      const mockSubscriberId = 5;
      component.deleteSubscription(mockSubscriberId);
      expect(apiDeleteSubscription).toHaveBeenCalledWith(mockSubscriberId);
      expect(component.errorDelete).toBeFalsy();
      expect(getSubscriptions).toHaveBeenCalled();
    }));
  });

  describe('closeAlert', () => {
    it('should set passed variable to false', () => {
      const mockError = 'errorLoad';
      component.errorLoad = true;
      component.closeAlert(mockError);
      expect(component.errorLoad).toBeFalsy();
    });
  });

});
