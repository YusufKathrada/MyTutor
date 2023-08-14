import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadTimesPage } from './upload-times.page';

const routes: Routes = [
  {
    path: '',
    component: UploadTimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadTimesPageRoutingModule {}
