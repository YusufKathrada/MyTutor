import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceCodesGeneratorPage } from './attendance-codes-generator.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceCodesGeneratorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceCodesGeneratorPageRoutingModule {}
