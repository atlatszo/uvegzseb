import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministratorsComponent } from './administrators.component';
import { AdministratorsRoutingModule } from './administrators-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCheckboxModule } from '../shared/components/custom-checkbox/custom-checkbox.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAccountModalContentComponent } from './delete-account-modal-content/delete-account-modal-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdministratorsRoutingModule,
    TranslateModule.forChild(),
    NgbModule,
    CustomCheckboxModule
  ],
  declarations: [
    AdministratorsComponent,
    DeleteAccountModalContentComponent
  ],
  entryComponents: [
    DeleteAccountModalContentComponent
  ]
})
export class AdministratorsModule {}
