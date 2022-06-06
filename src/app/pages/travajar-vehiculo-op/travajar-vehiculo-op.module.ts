import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravajarVehiculoOpPageRoutingModule } from './travajar-vehiculo-op-routing.module';

import { TravajarVehiculoOpPage } from './travajar-vehiculo-op.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravajarVehiculoOpPageRoutingModule
  ],
  declarations: [TravajarVehiculoOpPage]
})
export class TravajarVehiculoOpPageModule {}
