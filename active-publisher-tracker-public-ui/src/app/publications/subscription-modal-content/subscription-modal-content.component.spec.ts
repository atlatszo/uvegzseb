import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionModalContentComponent } from './subscription-modal-content.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ApiService } from '../../shared/services/api.service';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('SubscriptionModalContentComponent', () => {
  let component: SubscriptionModalContentComponent;
  let fixture: ComponentFixture<SubscriptionModalContentComponent>;

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
        FormsModule,
        ReactiveFormsModule,
        RecaptchaModule,
        NgbModule.forRoot()
      ],
      declarations: [SubscriptionModalContentComponent],
      providers: [
        MockBackend,
        BaseRequestOptions, {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        },
        NgbActiveModal,
        ApiService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
