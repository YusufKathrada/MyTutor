import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAllocateTutorsPageRoutingModule } from './admin-allocate-tutors-routing.module';

import { AdminAllocateTutorsPage } from './admin-allocate-tutors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAllocateTutorsPageRoutingModule
  ],
  declarations: [AdminAllocateTutorsPage]
})
export class AdminAllocateTutorsPageModule {}
