import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionModalContentComponent } from './subscription-modal-content/subscription-modal-content.component';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  public openSubscriptionModal(): void {
    const modalRef = this.modalService.open(SubscriptionModalContentComponent);
  }

}
