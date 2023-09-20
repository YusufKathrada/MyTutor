import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConvenerEditTaPageRoutingModule } from './convener-edit-ta-routing.module';

import { ConvenerEditTaPage } from './convener-edit-ta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConvenerEditTaPageRoutingModule
  ],
  declarations: [ConvenerEditTaPage]
})
export class ConvenerEditTaPageModule {}
