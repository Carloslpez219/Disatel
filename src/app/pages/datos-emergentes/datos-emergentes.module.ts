import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosEmergentesPageRoutingModule } from './datos-emergentes-routing.module';

import { DatosEmergentesPage } from './datos-emergentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosEmergentesPageRoutingModule
  ],
  declarations: [DatosEmergentesPage]
})
export class DatosEmergentesPageModule {}
