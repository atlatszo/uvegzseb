import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteAccountModalContentComponent } from './delete-account-modal-content.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Role } from '../../shared/classes/role';
import { Account } from '../../shared/classes/account';
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

describe('DeleteAccountModalContentComponent', () => {
  let component: DeleteAccountModalContentComponent;
  let fixture: ComponentFixture<DeleteAccountModalContentComponent>;
  const mockAccount = new Account(1, 'a-admin@mail.com', '2017-09-09Z11:11:12', Role.ADMIN);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
      ],
      declarations: [DeleteAccountModalContentComponent],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountModalContentComponent);
    component = fixture.componentInstance;
    component.account = mockAccount;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
