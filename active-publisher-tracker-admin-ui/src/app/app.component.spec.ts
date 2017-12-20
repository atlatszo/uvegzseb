import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HeaderModule } from './header/header.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from './shared/services/api.service';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HeaderComponent } from './header/header.component';

const translations: any = {
  'TEST': 'This is a test'
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translations);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    window['config'] = {
      backend: 'http://test-mock/backend'
    };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        HeaderModule
      ],
      declarations: [AppComponent],
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
    localStorage.setItem('token', jwtToken);
    window['config'] = mockConfig;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});

const jwtToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIya1J3aFdON1RUTEdaZWJFQnltVTJ2UTlINVFEd1R4TURncXI' +
  'xcmZaaFpvIn0.eyJqdGkiOiI5MGMxNWZkNy0wN2RjLTRjNDAtOGYwMC1kYTJjZTQwYzQzZWUiLCJleHAiOjE0OTY5MDk3MDcsIm5iZiI6MCwiaWF0IjoxNDk2OTA5ND' +
  'A3LCJpc3MiOiJodHRwczovL3Rhcy1hdXRoLnByZWNvZ25veC5jb20vYXV0aC9yZWFsbXMvcHJlY29nbm94IiwiYXVkIjoicHJlY29nbm94Iiwic3ViIjoiOWY1ZWJkN' +
  'WUtNmRiNS00NDI5LWE1NmUtYjQ1NTNjNjczNDAwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJlY29nbm94IiwiYXV0aF90aW1lIjoxNDk2OTAzNjI3LCJzZXNzaW9u' +
  'X3N0YXRlIjoiN2ZlOTQxZWQtNzA4Ni00MWQ0LWJhZTItZGJlZTQxYjVlMjNkIiwiYWNyIjoiMSIsImNsaWVudF9zZXNzaW9uIjoiYmExNjhmODItMjg3ZS00ZWE5LTg' +
  '4OWQtNGM1NjU1Y2EyZWIyIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioucHJlY29nbm94LmNvbS8qIiwiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicHJlY29nbm' +
  '94Iiwic3ZjX3RoZXNhdXJ1c19tYW5hZ2VyX2JhY2tlbmQiLCJ1bWFfYXV0aG9yaXphdGlvbiIsInN2Y190aGVzYXVydXNfbWFuYWdlciIsInN2Y190YXNfZnJvbnRlb' +
  'mQiLCJzdmNfdGFzX2JhY2tlbmQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctcmVhbG0iLCJ2aWV3LWlkZW50' +
  'aXR5LXByb3ZpZGVycyIsInZpZXctZXZlbnRzIiwibWFuYWdlLXVzZXJzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsInZpZXctYXV0aG9yaXphdGlvbiJdfSw' +
  'iYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IlZhbGVudGluby' +
  'BSb3NzaSIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3RtYW5hZ2V1c2VycyIsImdpdmVuX25hbWUiOiJWYWxlbnRpbm8iLCJmYW1pbHlfbmFtZSI6IlJvc3NpIiwiZ' +
  'W1haWwiOiJ0bWFuYWdlcnRlc3QrdGVzdG1hbmFnZXVzZXJzQGdtYWlsLmNvbSJ9.Ou-udoxuqJUVK4n7fY6Ghjbn7aYC1LxL23dkZfR0zO3BmNo4GwwDmcx-dTkK9R5' +
  '9XJpVMHKdngJRFyVvcYVdrCRnDj_tMbDiMFc64_6eJgeucE2b5i7ThcSIeg7_5PwWJmt19DSHuxUANWLzFOzmGIiktSUUeFEYYyOmyWfB0gAec2DMl-ZBqr_HUOlCPF' +
  '151PEVHFxmRDz3Kw6Iu0OD_TJUhql2sRjy6FYA6hIL5pnHHAyNWxIz8AQ3WGKeBMWcekG_MQfCjgLGqNYfezU9wtAcfzWkNtWWi756UTbXDJAyjjc4sXWa6SOlvSeYW' +
  '8xX6SsAAhd1WZCzQ6Oe8lv9yw';

const mockConfig = {
  backend: 'http://test-mock/backend',
  jwt: {
    header: {
      'alg': 'RS256',
      'typ': 'JWT',
      'kid': '2kRwhWN7TTLGZebEBymU2vQ9H5QDwTxMDgqr1rfZhZo'
    },
    payload: {
      'jti': '90c15fd7-07dc-4c40-8f00-da2ce40c43ee',
      'exp': 1496909707,
      'nbf': 0,
      'iat': 1496909407,
      'iss': 'https://tas-auth.precognox.com/auth/realms/precognox',
      'aud': 'precognox',
      'sub': '9f5ebd5e-6db5-4429-a56e-b4553c673400',
      'typ': 'Bearer',
      'azp': 'precognox',
      'auth_time': 1496903627,
      'session_state': '7fe941ed-7086-41d4-bae2-dbee41b5e23d',
      'acr': '1',
      'client_session': 'ba168f82-287e-4ea9-889d-4c5655ca2eb2',
      'allowed-origins': [
        '*.precognox.com/*',
        '*'
      ],
      'realm_access': {
        'roles': [
          'precognox',
          'svc_thesaurus_manager_backend',
          'uma_authorization',
          'svc_thesaurus_manager',
          'svc_tas_frontend',
          'svc_tas_backend'
        ]
      },
      'resource_access': {
        'realm-management': {
          'roles': [
            'view-realm',
            'view-identity-providers',
            'view-events',
            'manage-users',
            'view-users',
            'view-clients',
            'view-authorization'
          ]
        },
        'account': {
          'roles': [
            'manage-account',
            'manage-account-links',
            'view-profile'
          ]
        }
      },
      'name': 'Valentino Rossi',
      'preferred_username': 'testmanageusers',
      'given_name': 'Valentino',
      'family_name': 'Rossi',
      'email': 'tmanagertest+testmanageusers@gmail.com'
    }
  }
};
