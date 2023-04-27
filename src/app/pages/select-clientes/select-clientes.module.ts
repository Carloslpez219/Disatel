import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectClientesPageRoutingModule } from './select-clientes-routing.module';

import { SelectClientesPage } from './select-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectClientesPageRoutingModule
  ],
  declarations: [SelectClientesPage]
})
export class SelectClientesPageModule {}
