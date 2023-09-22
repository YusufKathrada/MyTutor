import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceCodesGeneratorPageRoutingModule } from './attendance-codes-generator-routing.module';

import { AttendanceCodesGeneratorPage } from './attendance-codes-generator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceCodesGeneratorPageRoutingModule
  ],
  declarations: [AttendanceCodesGeneratorPage]
})
export class AttendanceCodesGeneratorPageModule {}
