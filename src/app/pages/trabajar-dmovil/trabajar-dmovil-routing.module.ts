import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrabajarDmovilPage } from './trabajar-dmovil.page';

const routes: Routes = [
  {
    path: '',
    component: TrabajarDmovilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrabajarDmovilPageRoutingModule {}
