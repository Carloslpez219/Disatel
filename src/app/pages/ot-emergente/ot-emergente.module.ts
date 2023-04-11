import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OTEmergentePageRoutingModule } from './ot-emergente-routing.module';

import { OTEmergentePage } from './ot-emergente.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OTEmergentePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OTEmergentePage]
})
export class OTEmergentePageModule {}
