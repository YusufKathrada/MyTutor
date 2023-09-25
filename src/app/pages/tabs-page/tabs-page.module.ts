import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { UploadTimesPageModule } from '../upload-times/upload-times.module';
import { SelectTimesPageModule } from '../select-times/select-times.module';
import { ApplyForTutorPageModule } from '../apply-for-tutor/apply-for-tutor.module';

@NgModule({
  imports: [
    UploadTimesPageModule,
    SelectTimesPageModule,
    ApplyForTutorPageModule,
    CommonModule,
    IonicModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }
