import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelccionEquipoPageRoutingModule } from './selccion-equipo-routing.module';

import { SelccionEquipoPage } from './selccion-equipo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelccionEquipoPageRoutingModule
  ],
  declarations: [SelccionEquipoPage]
})
export class SelccionEquipoPageModule {}
