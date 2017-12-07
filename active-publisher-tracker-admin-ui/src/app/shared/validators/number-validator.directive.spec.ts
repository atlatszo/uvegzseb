import { decimalLengthValidator, decimalValidator } from './number-validator.directive';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('decimalValidator', () => {
  let component: DecimalValidatorTestComponent;
  let fixture: ComponentFixture<DecimalValidatorTestComponent>;
  const decimal = 'decimal';
  const decimalRange = 'decimalRange';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [DecimalValidatorTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecimalValidatorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  describe('form decimal control', () => {

    it('should be defined with value of null', () => {
      expect(component.form).not.toBeNull();
      expect(component.form.get(decimal).value).toBeNull();
    });

    it('should be valid', () => {
      component.form.patchValue({decimal: '0'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '1'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '3'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '4'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '5'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '6'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '7'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '8'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '9'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '0.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '1.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '3.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '4.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '5.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '6.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '8.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '9.'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.0'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.1'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.2'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.3'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.4'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.5'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.6'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.7'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.8'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.9'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.00'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.11'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.222'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.3333'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.44444'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.555555'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.6666666'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.77777777'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.888888888'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '.9999999999'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '9.11'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '8.222'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '7.3333'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '6.44444'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '5.555555'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '4.6666666'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '3.77777777'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '2.888888888'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '1.9999999999'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '0.00000000000'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '0.0'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '0.1'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '1.2'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '2.3'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '3.4'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '4.5'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '5.6'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '6.7'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '7.8'});
      expect(component.form.get(decimal).valid).toBeTruthy();
      component.form.patchValue({decimal: '9.9'});
      expect(component.form.get(decimal).valid).toBeTruthy();
    });

    it('should be invalid', () => {
      component.form.patchValue({decimal: 'abc'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '-'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '+'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '!'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: ','});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '.'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: ' '});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '?'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '%'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '='});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '('});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: ')'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '10'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '11'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '34'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '99'});
      expect(component.form.get(decimal).valid).toBeFalsy();
      component.form.patchValue({decimal: '100'});
      expect(component.form.get(decimal).valid).toBeFalsy();
    });
  });
  describe('form decimalRange control with decimal length of 1', () => {

    it('should be defined with value of null', () => {
      expect(component.form).not.toBeNull();
      expect(component.form.get(decimalRange).value).toBeNull();
    });

    it('should be valid', () => {
      component.form.patchValue({decimalRange: '0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '1'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '3'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '5'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
    });

    it('should be valid with point separator', () => {
      component.form.patchValue({decimalRange: '0.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '1.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '2.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '3.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '5.'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.1'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.2'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.3'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.4'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.5'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.6'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.7'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.8'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '.9'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '0.0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '0.1'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '1.2'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '2.3'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '3.4'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4.5'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4.9'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '5.0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
    });

    it('should be valid with comma separator', () => {
      component.form.patchValue({decimalRange: '0,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '1,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '2,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '3,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '5,'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',1'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',2'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',3'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',4'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',5'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',6'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',7'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',8'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: ',9'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '0,0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '0,1'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '1,2'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '2,3'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '3,4'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4,5'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '4,9'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
      component.form.patchValue({decimalRange: '5,0'});
      expect(component.form.get(decimalRange).valid).toBeTruthy();
    });

    it('should be invalid', () => {
      component.form.patchValue({decimalRange: 'abc'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '-'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '+'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '!'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ','});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ' '});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '?'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '%'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '='});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '('});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ')'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '-4'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '-1'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '-0'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '6'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '10'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '11'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '34'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '99'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '100'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
    });

    it('should be invalid with point separator', () => {
      component.form.patchValue({decimalRange: '6.'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '8.'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9.'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.00'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.11'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.222'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.3333'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.44444'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.555555'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.6666666'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.77777777'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.888888888'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '.9999999999'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9.11'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '8.222'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '7.3333'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '6.44444'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '5.555555'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '4.6666666'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '3.77777777'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '2.888888888'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '1.9999999999'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '0.00000000000'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '5.1'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '6.7'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '7.8'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9.9'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
    });

    it('should be invalid with comma separator', () => {
      component.form.patchValue({decimalRange: '6,'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '8,'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9,'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',00'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',11'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',222'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',3333'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',44444'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',555555'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',6666666'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',77777777'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',888888888'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: ',9999999999'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9,11'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '8,222'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '7,3333'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '6,44444'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '5,555555'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '4,6666666'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '3,77777777'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '2,888888888'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '1,9999999999'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '0,00000000000'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '5,1'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '6,7'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '7,8'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
      component.form.patchValue({decimalRange: '9,9'});
      expect(component.form.get(decimalRange).valid).toBeFalsy();
    });
  });
});

@Component({
  selector: 'app-decimal-validator-test',
  template: ``
})
class DecimalValidatorTestComponent implements OnInit {
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void { this.initForm(); }

  private initForm() {
    this.form = this.formBuilder.group({
      decimal: [null, [decimalValidator()]],
      decimalRange: [null, [decimalValidator(0, 5), decimalLengthValidator(1)]]
    });
  }
}
