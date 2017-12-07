import { TestBed, inject } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { ApiService } from '../services/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('AdminGuard', () => {
  beforeEach(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        AdminGuard,
        ApiService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should be created', inject([AdminGuard], (guard: AdminGuard) => {
    expect(guard).toBeTruthy();
  }));

});
