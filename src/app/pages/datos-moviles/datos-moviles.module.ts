import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosMovilesPageRoutingModule } from './datos-moviles-routing.module';

import { DatosMovilesPage } from './datos-moviles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosMovilesPageRoutingModule
  ],
  declarations: [DatosMovilesPage]
})
export class DatosMovilesPageModule {}
