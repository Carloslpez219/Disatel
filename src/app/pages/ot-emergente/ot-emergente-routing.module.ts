import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OTEmergentePage } from './ot-emergente.page';

const routes: Routes = [
  {
    path: '',
    component: OTEmergentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OTEmergentePageRoutingModule {}
