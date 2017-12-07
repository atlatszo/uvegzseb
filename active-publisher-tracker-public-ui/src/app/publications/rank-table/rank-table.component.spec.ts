import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RankTableComponent } from './rank-table.component';
import { ApiService } from '../../shared/services/api.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('RankTableComponent', () => {
  let component: RankTableComponent;
  let fixture: ComponentFixture<RankTableComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        InfiniteScrollModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        NgbModule.forRoot()
      ],
      declarations: [
        RankTableComponent
      ],
      providers: [
        ApiService,
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
    fixture = TestBed.createComponent(RankTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
