import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConvenerEditTaPage } from './convener-edit-ta.page';

const routes: Routes = [
  {
    path: '',
    component: ConvenerEditTaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConvenerEditTaPageRoutingModule {}
