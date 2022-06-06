import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelccionEquipoPage } from './selccion-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: SelccionEquipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelccionEquipoPageRoutingModule {}
