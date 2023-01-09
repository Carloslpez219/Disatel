import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InstalarsimPageRoutingModule } from './instalarsim-routing.module';

import { InstalarsimPage } from './instalarsim.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InstalarsimPageRoutingModule
  ],
  declarations: [InstalarsimPage]
})
export class InstalarsimPageModule {}
