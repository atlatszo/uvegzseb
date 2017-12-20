import { TestBed, inject } from '@angular/core/testing';
import { UnauthorizedGuard } from './unauthorized.guard';
import { ApiService } from '../services/api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('UnauthorizedGuard', () => {
  beforeEach(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        UnauthorizedGuard,
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

  it('should be created', inject([UnauthorizedGuard], (guard: UnauthorizedGuard) => {
    expect(guard).toBeTruthy();
  }));

});
