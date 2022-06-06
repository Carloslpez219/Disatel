import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravajarVehiculoOpPage } from './travajar-vehiculo-op.page';

const routes: Routes = [
  {
    path: '',
    component: TravajarVehiculoOpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravajarVehiculoOpPageRoutingModule {}
