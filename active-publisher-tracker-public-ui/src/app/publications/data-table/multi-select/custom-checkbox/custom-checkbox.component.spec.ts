import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomCheckboxComponent } from './custom-checkbox.component';

describe('CustomCheckboxComponent', () => {
  let component: CustomCheckboxComponent;
  let fixture: ComponentFixture<CustomCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onToggle', () => {

    it('should toggle and emit if not disabled', () => {
      component.isDisabled = false;
      component.isChecked = false;
      const emit = spyOn(component.toggled, 'emit');
      component.onToggle();
      expect(component.isChecked).toBeTruthy();
      expect(emit).toHaveBeenCalledWith(component.isChecked);
      component.onToggle();
      expect(component.isChecked).toBeFalsy();
      expect(emit).toHaveBeenCalledWith(component.isChecked);
    });

    it('should not toggle and emit if disabled', () => {
      component.isDisabled = true;
      component.isChecked = false;
      const emit = spyOn(component.toggled, 'emit');
      component.onToggle();
      expect(component.isChecked).toBeFalsy();
      expect(emit).not.toHaveBeenCalled();
      component.isChecked = true;
      component.onToggle();
      expect(component.isChecked).toBeTruthy();
      expect(emit).not.toHaveBeenCalled();
    });
  });

});
