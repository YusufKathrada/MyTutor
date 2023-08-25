import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminReviewApplicationsPageRoutingModule } from './admin-review-applications-routing.module';

import { AdminReviewApplicationsPage } from './admin-review-applications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminReviewApplicationsPageRoutingModule
  ],
  declarations: [AdminReviewApplicationsPage]
})
export class AdminReviewApplicationsPageModule {}
