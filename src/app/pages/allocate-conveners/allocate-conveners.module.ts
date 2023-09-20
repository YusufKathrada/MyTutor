import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllocateConvenersPageRoutingModule } from './allocate-conveners-routing.module';

import { AllocateConvenersPage } from './allocate-conveners.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllocateConvenersPageRoutingModule
  ],
  declarations: [AllocateConvenersPage]
})
export class AllocateConvenersPageModule {}
