import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTimesPageRoutingModule } from './select-times-routing.module';

import { SelectTimesPage } from './select-times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectTimesPageRoutingModule
  ],
  declarations: [SelectTimesPage]
})
export class SelectTimesPageModule {}
