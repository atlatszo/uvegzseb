import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DeleteSubscriptionModalContentComponent } from './delete-subscription-modal-content.component';
import { Subscription } from '../../shared/classes/subscription';
import { DeleteModalResult } from '../../shared/classes/delete-modal-result';
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

describe('DeleteSubscriptionModalContentComponent', () => {
  let component: DeleteSubscriptionModalContentComponent;
  let fixture: ComponentFixture<DeleteSubscriptionModalContentComponent>;
  const mockSubscriber = new Subscription(1, 'a-admin@mail.com', '2017-09-09Z11:11:12');

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
      declarations: [DeleteSubscriptionModalContentComponent],
      providers: [NgbActiveModal]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubscriptionModalContentComponent);
    component = fixture.componentInstance;
    component.subscription = mockSubscriber;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('delete()', () => {
    it('should call close on activeModal with result delete', inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
      const close = spyOn(activeModal, 'close').and.returnValue(null);
      component.delete();
      expect(close).toHaveBeenCalledWith(DeleteModalResult.DELETE);
    }));
  });

  describe('cancel()', () => {
    it('should call close on activeModal with result cancel', inject([NgbActiveModal], (activeModal: NgbActiveModal) => {
      const close = spyOn(activeModal, 'close').and.returnValue(null);
      component.cancel();
      expect(close).toHaveBeenCalledWith(DeleteModalResult.CANCEL);
    }));
  });

});
