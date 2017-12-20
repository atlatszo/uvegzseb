import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private title: Title, private translate: TranslateService) { }

  ngOnInit(): void {
    this.initTitle();
    this.initTranslations();
  }

  private initTranslations(): void {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  private initTitle(): void {
    this.title.setTitle('Active Publisher Tracker');
  }

}
