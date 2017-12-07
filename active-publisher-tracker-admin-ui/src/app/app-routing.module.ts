import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { UnauthorizedGuard } from './shared/guards/unauthorized.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'administrators',
    pathMatch: 'full'
  },
  {
    path: 'administrators',
    loadChildren: 'app/administrators/administrators.module#AdministratorsModule',
    canActivate: [AdminGuard]
  },
  {
    path: 'data-owners',
    loadChildren: 'app/data-owners/data-owners.module#DataOwnersModule',
    canActivate: [AdminGuard]
  },
  {
    path: 'subscriptions',
    loadChildren: 'app/subscriptions/subscriptions.module#SubscriptionsModule',
    canActivate: [AdminGuard]
  },
  {
    path: 'unauthorized',
    loadChildren: 'app/unauthorized/unauthorized.module#UnauthorizedModule',
    canActivate: [UnauthorizedGuard]
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
export class AppRoutingModule {}
