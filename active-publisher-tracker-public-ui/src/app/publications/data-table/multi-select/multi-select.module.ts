import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from './multi-select.component';
import { CustomCheckboxModule } from './custom-checkbox/custom-checkbox.module';
import { SortSelectOptionsPipe } from './sort-select-options.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomCheckboxModule
  ],
  declarations: [
    MultiSelectComponent,
    SortSelectOptionsPipe
  ],
  exports: [MultiSelectComponent]
})
export class MultiSelectModule {}
