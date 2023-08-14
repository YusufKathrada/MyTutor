import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyForTutorPage } from './apply-for-tutor.page';

const routes: Routes = [
  {
    path: '',
    component: ApplyForTutorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyForTutorPageRoutingModule {}
