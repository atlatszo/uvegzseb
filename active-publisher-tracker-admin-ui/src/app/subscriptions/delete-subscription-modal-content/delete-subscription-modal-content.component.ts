import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from '../../shared/classes/subscription';
import { DeleteModalResult } from '../../shared/classes/delete-modal-result';

@Component({
  selector: 'app-delete-subscription-modal-content',
  templateUrl: './delete-subscription-modal-content.component.html',
  styleUrls: ['./delete-subscription-modal-content.component.scss']
})
export class DeleteSubscriptionModalContentComponent {

  public translationKey = 'delete_subscription_modal.';
  @Input() subscription: Subscription;

  constructor(public activeModal: NgbActiveModal) { }

  public delete(): void {
    this.activeModal.close(DeleteModalResult.DELETE);
  }

  public cancel(): void {
    this.activeModal.close(DeleteModalResult.CANCEL);
  }

}
