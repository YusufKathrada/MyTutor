import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorEventsPage } from './tutor-events.page';

const routes: Routes = [
  {
    path: '',
    component: TutorEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorEventsPageRoutingModule {}
