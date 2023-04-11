import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajarEmergentesPageRoutingModule } from './trabajar-emergentes-routing.module';

import { TrabajarEmergentesPage } from './trabajar-emergentes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajarEmergentesPageRoutingModule
  ],
  declarations: [TrabajarEmergentesPage]
})
export class TrabajarEmergentesPageModule {}
