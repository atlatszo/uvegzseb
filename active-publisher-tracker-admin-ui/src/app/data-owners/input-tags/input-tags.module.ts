import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTagsComponent } from './input-tags.component';
import { FormsModule } from '@angular/forms';
import { InputTagsDirective } from './input-tags.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    InputTagsComponent,
    InputTagsDirective
  ],
  exports: [InputTagsComponent]
})
export class InputTagsModule { }
