import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewApplicationStatusPageRoutingModule } from './view-application-status-routing.module';

import { ViewApplicationStatusPage } from './view-application-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewApplicationStatusPageRoutingModule
  ],
  declarations: [ViewApplicationStatusPage]
})
export class ViewApplicationStatusPageModule {}
