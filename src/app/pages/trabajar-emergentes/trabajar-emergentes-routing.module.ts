import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrabajarEmergentesPage } from './trabajar-emergentes.page';

const routes: Routes = [
  {
    path: '',
    component: TrabajarEmergentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrabajarEmergentesPageRoutingModule {}
