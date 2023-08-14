import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplyForTutorPageRoutingModule } from './apply-for-tutor-routing.module';

import { ApplyForTutorPage } from './apply-for-tutor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplyForTutorPageRoutingModule
  ],
  declarations: [ApplyForTutorPage]
})
export class ApplyForTutorPageModule {}
