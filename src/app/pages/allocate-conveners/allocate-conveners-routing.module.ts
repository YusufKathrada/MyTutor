import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllocateConvenersPage } from './allocate-conveners.page';

const routes: Routes = [
  {
    path: '',
    component: AllocateConvenersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllocateConvenersPageRoutingModule {}
