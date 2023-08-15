import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UploadTableComponent } from '../app/components/upload-table/upload-table.component';

@NgModule({
	declarations: [
    UploadTableComponent
	],
	imports: [
		CommonModule,
		IonicModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [
		UploadTableComponent
	],
	providers: [],
})
export class SharedModule { }
