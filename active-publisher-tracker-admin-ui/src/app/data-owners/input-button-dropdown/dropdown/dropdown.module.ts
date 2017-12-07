import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownDirective } from './dropdown.directive';
import { DropdownFilterPipe } from './dropdown-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DropdownComponent,
    DropdownDirective,
    DropdownFilterPipe
  ],
  exports: [DropdownComponent]
})
export class DropdownModule {}
