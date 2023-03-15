import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajarDmovilPageRoutingModule } from './trabajar-dmovil-routing.module';

import { TrabajarDmovilPage } from './trabajar-dmovil.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajarDmovilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TrabajarDmovilPage]
})
export class TrabajarDmovilPageModule {}
