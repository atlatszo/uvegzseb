import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputButtonDropdownComponent } from './input-button-dropdown.component';
import { DropdownModule } from './dropdown/dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  declarations: [InputButtonDropdownComponent],
  exports: [InputButtonDropdownComponent]
})
export class InputButtonDropdownModule {}
