import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosBodegaPage } from './usuarios-bodega.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosBodegaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosBodegaPageRoutingModule {}
