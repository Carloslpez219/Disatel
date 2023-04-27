import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectClientesPage } from './select-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: SelectClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectClientesPageRoutingModule {}
