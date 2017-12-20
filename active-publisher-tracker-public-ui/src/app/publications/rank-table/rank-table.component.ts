import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { RankedData } from '../../shared/classes/ranked-data';
import { RankedDataResponse } from '../../shared/classes/ranked-data-response';

@Component({
  selector: 'app-rank-table',
  templateUrl: './rank-table.component.html',
  styleUrls: ['./rank-table.component.scss']
})
export class RankTableComponent implements OnInit {
  public translationKey = 'rankTable.';
  public rankedData: RankedData[] = [];
  public start = 0;
  public rows = 15;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getRankedData();
  }

  public onScroll(): void {
    this.start += this.rows;
    this.getRankedData();
  }

  public getRankedData(): void {
    this.apiService.getRankedData(this.start, this.rows).subscribe(
      (rankedData: RankedDataResponse) => {
        this.rankedData = this.rankedData.concat(rankedData.ranking);
      },
      error => console.error(error)
    );
  }

}
