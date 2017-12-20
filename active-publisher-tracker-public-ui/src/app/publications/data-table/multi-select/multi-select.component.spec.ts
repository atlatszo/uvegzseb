import { RouterTestingModule } from '@angular/router/testing';
import { IMultiSelectOption, MultiSelectComponent } from './multi-select.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SortSelectOptionsPipe } from './sort-select-options.pipe';
import { CustomCheckboxModule } from './custom-checkbox/custom-checkbox.module';

describe('MultiSelectComponent', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let component: MultiSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CustomCheckboxModule
      ],
      declarations: [
        MultiSelectComponent,
        SortSelectOptionsPipe
      ]
    });
    TestBed.compileComponents();
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create the MultiSelect component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {

    it('should set disabledRef if not equal with isDisabled', () => {
      component.isDisabled = true;
      component.ngOnChanges();
      expect(component['disabledRef']).toBeTruthy();
    });

    it('should not set disabledRef if equal with isDisabled', () => {
      component['disabledRef'] = true;
      component.isDisabled = true;
      component.ngOnChanges();
      expect(component['disabledRef']).toBeTruthy();
    });

    it('should call initOptions if multi and dataOwnerOptions are different from default', () => {
      const isOptionsDifferent = spyOn<any>(component, 'isOptionsDifferent').and.returnValue(true);
      const initOptions = spyOn<any>(component, 'initOptions');
      const mockOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: true
        }
      ];
      component.multi = true;
      component.options = mockOptions;
      component.ngOnChanges();
      expect(initOptions).toHaveBeenCalled();
      expect(isOptionsDifferent).toHaveBeenCalledTimes(1);
    });

    it('should call initOptions if not multi and dataOwnerOptions are different from default and optionsRef is not set', () => {
      const isOptionsDifferent = spyOn<any>(component, 'isOptionsDifferent').and.returnValue(true);
      const initOptions = spyOn<any>(component, 'initOptions');
      const mockOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: true
        }
      ];
      component.multi = false;
      component.options = mockOptions;
      component.optionsRef = [];
      component.ngOnChanges();
      expect(initOptions).toHaveBeenCalled();
      expect(isOptionsDifferent).toHaveBeenCalledTimes(1);
    });

    it('should not call initOptions if dataOwnerOptions is not set', () => {
      const initOptions = spyOn<any>(component, 'initOptions');
      component.options = [];
      component.ngOnChanges();
      expect(initOptions).not.toHaveBeenCalled();
    });

    it('should not call initOptions if isOptionsDifferent return with false', () => {
      const isOptionsDifferent = spyOn<any>(component, 'isOptionsDifferent').and.returnValue(false);
      const initOptions = spyOn<any>(component, 'initOptions');
      const mockOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: true
        }
      ];
      component.multi = false;
      component.options = mockOptions;
      component.optionsRef = [];
      component.ngOnChanges();
      expect(initOptions).not.toHaveBeenCalled();
      expect(isOptionsDifferent).toHaveBeenCalledTimes(1);
    });

    it('should not call initOptions if not multi and optionsRef is set', () => {
      spyOn<any>(component, 'isOptionsDifferent').and.returnValue(false);
      const initOptions = spyOn<any>(component, 'initOptions');
      const mockOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: true
        }
      ];
      component.multi = false;
      component.options = mockOptions;
      component.optionsRef = mockOptions;
      component.ngOnChanges();
      expect(initOptions).not.toHaveBeenCalled();
    });
  });

  describe('onBtnClick()', () => {

    it('should toggle open', () => {
      component.open = false;
      component.onBtnClick();
      expect(component.open).toBeTruthy();
      component.onBtnClick();
      expect(component.open).toBeFalsy();
    });
  });

  describe('hideMenu()', () => {

    it('should set open to false', () => {
      component.open = true;
      component.hideMenu();
      expect(component.open).toBeFalsy();
      component.open = false;
      component.hideMenu();
      expect(component.open).toBeFalsy();
    });
  });

  describe('onMenuItemClick()', () => {

    describe('if multi is true', () => {

      it('should call preventDefault on event and set selected property of option and emit changes', () => {
        const mockEvent = new MouseEvent('click');
        const mockOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: false
          },
          {
            id: 'id2',
            value: 'name2',
            selected: true
          }
        ];
        spyOn(mockEvent, 'preventDefault');
        const emitSelected = spyOn<any>(component, 'emitSelected').and.callFake(() => {
          return;
        });
        component.multi = true;
        component['optionsRef'] = mockOptions;
        component.onMenuItemClick(mockEvent, mockOptions[0]);
        expect(component['optionsRef'][0].selected).toBeTruthy();
        component.onMenuItemClick(mockEvent, mockOptions[0]);
        expect(component['optionsRef'][0].selected).toBeFalsy();
        expect(emitSelected).toHaveBeenCalled();
      });
    });

    describe('if multi is false', () => {

      it('should not call preventDefault and should not emit changes if the id of singleSelect is same as option', () => {
        const mockEvent = new MouseEvent('click');
        const mockOption: IMultiSelectOption = {
          id: 'id1',
          value: 'name1',
          selected: false
        };
        spyOn(mockEvent, 'preventDefault');
        const emitSelected = spyOn<any>(component, 'emitSelected');
        component.multi = false;
        component['singleSelected'] = mockOption;
        component.onMenuItemClick(mockEvent, mockOption);
        expect(emitSelected).not.toHaveBeenCalled();
      });

      it('should emit changes if the id of singleSelect is different from option and set optionsRef selected', () => {
        const mockEvent = new MouseEvent('click');
        const mockOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: false
          },
          {
            id: 'id2',
            value: 'name2',
            selected: true
          }
        ];
        const expectedOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: true
          },
          {
            id: 'id2',
            value: 'name2',
            selected: false
          }
        ];
        spyOn(mockEvent, 'preventDefault');
        const emitSelected = spyOn<any>(component, 'emitSelected');
        component.multi = false;
        component['singleSelected'] = mockOptions[1];
        component.optionsRef = mockOptions;
        component.onMenuItemClick(mockEvent, mockOptions[0]);
        expect(component['singleSelected']).toEqual(mockOptions[0]);
        expect(component.optionsRef).toEqual(expectedOptions);
        expect(emitSelected).toHaveBeenCalled();
      });
    });
  });

  describe('getPlaceholder()', () => {

    describe('if multi is true', () => {

      it('should return default placeholder', () => {
        const mockOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: false
          },
          {
            id: 'id2',
            value: 'name2',
            selected: false
          }
        ];
        const mockPlaceHolder = 'MultiSelect placeholder';
        component.multi = true;
        component.placeholder = mockPlaceHolder;
        component.optionsRef = mockOptions;
        expect(component.getPlaceholder()).toBe(mockPlaceHolder);
      });

      it('should return placeholder if dataOwnerOptions are selected', () => {
        const mockOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: true
          },
          {
            id: 'id2',
            value: 'name2',
            selected: false
          }
        ];
        const mockPlaceHolder = 'Selected';
        component.multi = true;
        component.optionsRef = mockOptions;
        expect(component.getPlaceholder()).toBe('1 ' + mockPlaceHolder);
        component.optionsRef[1].selected = true;
        expect(component.getPlaceholder()).toBe('2 ' + mockPlaceHolder);
      });
    });

    describe('if multi is false', () => {

      it('should return default placeholder if singleSelected is not set', () => {
        const mockPlaceHolder = 'SingleSelect placeholder';
        component.placeholder = mockPlaceHolder;
        component.multi = false;
        expect(component.getPlaceholder()).toBe(mockPlaceHolder);
      });

      it('should return placeholder if singleSelected set', () => {
        const mockOptions: IMultiSelectOption[] = [
          {
            id: 'id1',
            value: 'name1',
            selected: true
          },
          {
            id: 'id2',
            value: 'name2',
            selected: false
          }
        ];
        component.multi = false;
        component['singleSelected'] = mockOptions[0];
        expect(component.getPlaceholder()).toBe(mockOptions[0].value);
      });
    });
  });

  describe('initOptions()', () => {

    it('should init optionsRef and should not emit changes if optionsRef was empty and defaultOption is not set', () => {
      const emitSelected = spyOn<any>(component, 'emitSelected').and.callFake(() => {
        return;
      });
      const expectedOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component.optionsRef = [];
      component.options = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component['initOptions'](component.options);
      expect(component.optionsRef).toEqual(expectedOptions);
      expect(emitSelected).not.toHaveBeenCalled();
    });

    it('should init optionsRef and should not emit changes if optionsRef was empty and defaultOption is set', () => {
      const emitSelected = spyOn<any>(component, 'emitSelected').and.callFake(() => {
        return;
      });
      const expectedOptions: IMultiSelectOption[] = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component.optionsRef = [];
      component.options = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component.defaultOption = component.options[0].id;
      component['initOptions'](component.options);
      expect(component.optionsRef).toEqual(expectedOptions);
      expect(emitSelected).not.toHaveBeenCalled();
    });

    it('should init optionsRef and should emit changes if optionsRef was not empty', () => {
      const emitSelected = spyOn<any>(component, 'emitSelected').and.callFake(() => {
        return;
      });
      component.optionsRef = [
        {
          id: 'id1',
          value: 'name1',
          selected: false
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component['initOptions']([]);
      expect(component.optionsRef).toEqual([]);
      expect(emitSelected).toHaveBeenCalled();
    });
  });

  describe('emitSelected()', () => {

    it('should emit ids of the selected dataOwnerOptions if multi is true', () => {
      const emit = spyOn(component.optionsChanged, 'emit');
      component.multi = true;
      component.optionsRef = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id3',
          value: 'name3',
          selected: true
        }
      ];
      component['emitSelected']();
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith([component.optionsRef[0].id, component.optionsRef[2].id]);
    });

    it('should emit id of the selected option if set if multi is false', () => {
      const emit = spyOn(component.optionsChanged, 'emit');
      component.multi = false;
      component['singleSelected'] = {
        id: 'id1',
        value: 'name1',
        selected: true
      };
      component['emitSelected']();
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith(component['singleSelected'].id);
    });

    it('should not emit if not set if multi is false', () => {
      const emit = spyOn(component.optionsChanged, 'emit');
      component.multi = false;
      component['singleSelected'] = undefined;
      component['emitSelected']();
      expect(emit).toHaveBeenCalledWith(null);
    });
  });

  describe('isOptionsDifferent()', () => {

    it('should return true if new dataOwnerOptions and optionsRef length are different', () => {
      component.options = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        }
      ];
      component.optionsRef = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id3',
          value: 'name3',
          selected: true
        }
      ];
      expect(component['isOptionsDifferent']()).toBeTruthy();
    });

    it('should return true if new dataOwnerOptions and optionsRef length are the same but their properties are different', () => {
      component.options = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id4',
          value: 'name4',
          selected: true
        }
      ];
      component.optionsRef = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id3',
          value: 'name3',
          selected: true
        }
      ];
      expect(component['isOptionsDifferent']()).toBeTruthy();
    });

    it('should return false if new dataOwnerOptions and optionsRef the same', () => {
      component.options = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id3',
          value: 'name3',
          selected: true
        }
      ];
      component.optionsRef = [
        {
          id: 'id1',
          value: 'name1',
          selected: true
        },
        {
          id: 'id2',
          value: 'name2',
          selected: false
        },
        {
          id: 'id3',
          value: 'name3',
          selected: false
        }
      ];
      component.defaultOption = component.options[0].id;
      expect(component['isOptionsDifferent']()).toBeFalsy();
    });
  });

});
