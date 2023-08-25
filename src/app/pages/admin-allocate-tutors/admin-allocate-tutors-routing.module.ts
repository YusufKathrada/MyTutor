import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAllocateTutorsPage } from './admin-allocate-tutors.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAllocateTutorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAllocateTutorsPageRoutingModule {}
