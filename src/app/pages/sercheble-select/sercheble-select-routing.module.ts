import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SerchebleSelectPage } from './sercheble-select.page';

const routes: Routes = [
  {
    path: '',
    component: SerchebleSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SerchebleSelectPageRoutingModule {}
