import { DropdownDirective } from './dropdown.directive';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('DropdownDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveEl;
  let directiveInstance;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        DropdownDirective
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(DropdownDirective));
    directiveInstance = directiveEl.injector.get(DropdownDirective);
    fixture.detectChanges();
  });

  it('should create test component', () => {
    expect(component).toBeTruthy();
  });

  it('should create directive', () => {
    expect(directiveEl).not.toBeNull();
    expect(directiveInstance).not.toBeNull();
  });

});

@Component({
  selector: 'app-component-for-testing-dropdown-directive',
  template: `
    <section
      id="Dropdown"
      appDropdown
      [inputId]="inputId"
      (clickedOutside)="onClickOutside()"
      (clickedInInput)="onClickInInput()"
      (enter)="onEnterTyped()"
      (escape)="onEscapeTyped()"
      (tab)="onTabTyped()"
      (moveUp)="onMoveUp()"
      (moveDown)="onMoveDown()"
      class="dropdown"
    ></section>`
})
class TestComponent {}
