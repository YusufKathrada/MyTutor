import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewApplicationStatusPage } from './view-application-status.page';

const routes: Routes = [
  {
    path: '',
    component: ViewApplicationStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewApplicationStatusPageRoutingModule {}
