import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InputButtonDropdownComponent } from './input-button-dropdown.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from './dropdown/dropdown.module';

describe('InputButtonDropdownComponent', () => {
  let component: InputButtonDropdownComponent;
  let fixture: ComponentFixture<InputButtonDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, DropdownModule],
      declarations: [InputButtonDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputButtonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
