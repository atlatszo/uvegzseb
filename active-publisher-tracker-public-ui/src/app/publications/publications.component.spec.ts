import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicationsComponent } from './publications.component';
import { DataTableModule } from './data-table/data-table.module';
import { RankTableModule } from './rank-table/rank-table.module';
import { ApiService } from '../shared/services/api.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { RecaptchaModule } from 'ng-recaptcha';
import { SubscriptionModalContentComponent } from './subscription-modal-content/subscription-modal-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

describe('PublicationsComponent', () => {
  let component: PublicationsComponent;
  let fixture: ComponentFixture<PublicationsComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        DataTableModule,
        RankTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        RecaptchaModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      declarations: [
        PublicationsComponent,
        SubscriptionModalContentComponent
      ],
      providers: [
        ApiService,
        NgbActiveModal,
        MockBackend,
        BaseRequestOptions, {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
