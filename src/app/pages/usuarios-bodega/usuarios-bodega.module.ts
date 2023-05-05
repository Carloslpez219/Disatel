import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosBodegaPageRoutingModule } from './usuarios-bodega-routing.module';

import { UsuariosBodegaPage } from './usuarios-bodega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosBodegaPageRoutingModule
  ],
  declarations: [UsuariosBodegaPage]
})
export class UsuariosBodegaPageModule {}
