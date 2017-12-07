import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Account } from '../../shared/classes/account';
import { DeleteModalResult } from '../../shared/classes/delete-modal-result';

@Component({
  selector: 'app-delete-account-modal-content',
  templateUrl: './delete-account-modal-content.component.html',
  styleUrls: ['./delete-account-modal-content.component.scss']
})
export class DeleteAccountModalContentComponent {

  @Input() account: Account;
  public translationKey = 'delete_account_modal.';

  constructor(public activeModal: NgbActiveModal) { }

  public delete(): void {
    this.activeModal.close(DeleteModalResult.DELETE);
  }

  public cancel(): void {
    this.activeModal.close(DeleteModalResult.CANCEL);
  }

}
