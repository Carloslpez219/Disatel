import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccesoriosPage } from './accesorios.page';

const routes: Routes = [
  {
    path: '',
    component: AccesoriosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccesoriosPageRoutingModule {}
