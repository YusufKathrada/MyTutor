import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadTimesPageRoutingModule } from './upload-times-routing.module';

import { UploadTimesPage } from './upload-times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UploadTimesPageRoutingModule
  ],
  declarations: [UploadTimesPage]
})
export class UploadTimesPageModule {}
