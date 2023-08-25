import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminReviewApplicationsPage } from './admin-review-applications.page';

const routes: Routes = [
  {
    path: '',
    component: AdminReviewApplicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminReviewApplicationsPageRoutingModule {}
