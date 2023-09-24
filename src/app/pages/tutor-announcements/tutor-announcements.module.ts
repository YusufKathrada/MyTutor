import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorAnnouncementsPageRoutingModule } from './tutor-announcements-routing.module';

import { TutorAnnouncementsPage } from './tutor-announcements.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorAnnouncementsPageRoutingModule
  ],
  declarations: [TutorAnnouncementsPage]
})
export class TutorAnnouncementsPageModule {}
