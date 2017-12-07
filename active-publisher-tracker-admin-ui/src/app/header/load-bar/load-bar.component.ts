import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-load-bar',
  templateUrl: './load-bar.component.html',
  styleUrls: ['./load-bar.component.scss']
})
export class LoadBarComponent implements OnInit, OnDestroy {

  public isLoading;
  private subscriptions: Array<Subscription> = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.subscribeToIsLoading();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  private subscribeToIsLoading(): void {
    this.subscriptions.push(this.apiService.isLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading,
      error => console.error(error)
    ));
  }

}
