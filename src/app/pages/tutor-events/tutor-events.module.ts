import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorEventsPageRoutingModule } from './tutor-events-routing.module';

import { TutorEventsPage } from './tutor-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorEventsPageRoutingModule
  ],
  declarations: [TutorEventsPage]
})
export class TutorEventsPageModule {}
