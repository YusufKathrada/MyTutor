import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorAttendancePage } from './tutor-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: TutorAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorAttendancePageRoutingModule {}
