import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTagsComponent } from './input-tags.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTagsDirective } from './input-tags.directive';
import { FormsModule } from '@angular/forms';

describe('InputTagsComponent', () => {
  let component: InputTagsComponent;
  let fixture: ComponentFixture<InputTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgbModule.forRoot()
      ],
      declarations: [
        InputTagsComponent,
        InputTagsDirective
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
