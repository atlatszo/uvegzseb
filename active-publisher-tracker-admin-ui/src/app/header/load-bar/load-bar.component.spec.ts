import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadBarComponent } from './load-bar.component';
import { ApiService } from '../../shared/services/api.service';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('LoadBarComponent', () => {
  let component: LoadBarComponent;
  let fixture: ComponentFixture<LoadBarComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      declarations: [LoadBarComponent],
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
    fixture = TestBed.createComponent(LoadBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
