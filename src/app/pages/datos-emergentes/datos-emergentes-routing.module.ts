import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosEmergentesPage } from './datos-emergentes.page';

const routes: Routes = [
  {
    path: '',
    component: DatosEmergentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosEmergentesPageRoutingModule {}
