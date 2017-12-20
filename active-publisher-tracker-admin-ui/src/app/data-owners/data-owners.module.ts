import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataOwnersComponent } from './data-owners.component';
import { DataOwnersRoutingModule } from './data-owners-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from './multi-select/multi-select.module';
import { InputButtonDropdownModule } from './input-button-dropdown/input-button-dropdown.module';
import { CustomCheckboxModule } from '../shared/components/custom-checkbox/custom-checkbox.module';
import { InputTagsModule } from './input-tags/input-tags.module';
import { TruncateModule } from '../shared/pipes/truncate/truncate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataOwnersRoutingModule,
    TranslateModule.forChild(),
    NgbModule,
    MultiSelectModule,
    CustomCheckboxModule,
    InputButtonDropdownModule,
    InputTagsModule,
    TruncateModule
  ],
  declarations: [DataOwnersComponent]
})
export class DataOwnersModule {}
