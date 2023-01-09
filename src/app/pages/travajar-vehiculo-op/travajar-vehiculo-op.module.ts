import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravajarVehiculoOpPageRoutingModule } from './travajar-vehiculo-op-routing.module';

import { TravajarVehiculoOpPage } from './travajar-vehiculo-op.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravajarVehiculoOpPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TravajarVehiculoOpPage]
})
export class TravajarVehiculoOpPageModule {}
