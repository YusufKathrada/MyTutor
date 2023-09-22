import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorAttendancePageRoutingModule } from './tutor-attendance-routing.module';

import { TutorAttendancePage } from './tutor-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorAttendancePageRoutingModule
  ],
  declarations: [TutorAttendancePage]
})
export class TutorAttendancePageModule {}
