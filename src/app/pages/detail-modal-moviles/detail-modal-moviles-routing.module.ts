import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailModalMovilesPage } from './detail-modal-moviles.page';

const routes: Routes = [
  {
    path: '',
    component: DetailModalMovilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailModalMovilesPageRoutingModule {}
