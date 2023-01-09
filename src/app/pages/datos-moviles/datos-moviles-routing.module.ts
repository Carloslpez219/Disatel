import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosMovilesPage } from './datos-moviles.page';

const routes: Routes = [
  {
    path: '',
    component: DatosMovilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosMovilesPageRoutingModule {}
