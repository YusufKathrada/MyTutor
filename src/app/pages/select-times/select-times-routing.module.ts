import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTimesPage } from './select-times.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTimesPageRoutingModule {}
