import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { UnsubscribeComponent } from './unsubscribe.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
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

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;

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
        })
      ],
      declarations: [UnsubscribeComponent],
      providers: [
        ApiService,
        BaseRequestOptions,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: {'uuid': 'token', 'email': 'asd'}}
          }
        },
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
    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display no message when pending', () => {
    component.ngOnInit();
    expect(component.isError).toBe(false);
    expect(component.isUnSubscribed).toBe(false);
  });

  it('should display error message when backend sends error', inject([ApiService], (apiService: ApiService) => {
    spyOn<any>(apiService, 'unSubscribeEmail').and.callFake(() => {
      return Observable.create(observer => {
        observer.error();
      });
    });
    component.ngOnInit();
    expect(component.isError).toBe(true);
  }));

  it('should display successful message when backend sends error', inject([ApiService], (apiService: ApiService) => {
    spyOn<any>(apiService, 'unSubscribeEmail').and.callFake(() => {
      return Observable.create(observer => {
        observer.next();
      });
    });
    component.ngOnInit();
    expect(component.isUnSubscribed).toBe(true);
  }));

});
