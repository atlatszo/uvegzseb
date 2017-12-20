import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataOwnersComponent } from './data-owners.component';

const routes: Routes = [
  {
    path: '',
    component: DataOwnersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataOwnersRoutingModule { }
