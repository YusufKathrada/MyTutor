import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorAnnouncementsPage } from './tutor-announcements.page';

const routes: Routes = [
  {
    path: '',
    component: TutorAnnouncementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorAnnouncementsPageRoutingModule {}
