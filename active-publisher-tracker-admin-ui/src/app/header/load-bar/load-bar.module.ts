import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadBarComponent } from './load-bar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadBarComponent],
  exports: [LoadBarComponent]
})
export class LoadBarModule {}
