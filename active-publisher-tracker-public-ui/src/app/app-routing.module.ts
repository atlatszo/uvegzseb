import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'publications',
    loadChildren: 'app/publications/publications.module#PublicationsModule'
  },
  {
    path: 'data-owners',
    loadChildren: 'app/data-owners/data-owners.module#DataOwnersModule'
  },
  {
    path: 'how-it-works',
    loadChildren: 'app/how-it-works/how-it-works.module#HowItWorksModule'
  },
  {
    path: 'impressum',
    loadChildren: 'app/impressum/impressum.module#ImpressumModule'
  },
  {
    path: 'legal-notice',
    loadChildren: 'app/legal-notice/legal-notice.module#LegalNoticeModule'
  },
  {
    path: 'about',
    loadChildren: 'app/about/about.module#AboutModule'
  },
  {
    path: 'unsubscribe/:uuid/:email',
    loadChildren: 'app/unsubscribe/unsubscribe.module#UnsubscribeModule'
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
