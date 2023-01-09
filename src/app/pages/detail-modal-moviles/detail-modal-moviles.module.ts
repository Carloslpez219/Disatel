import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailModalMovilesPageRoutingModule } from './detail-modal-moviles-routing.module';

import { DetailModalMovilesPage } from './detail-modal-moviles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailModalMovilesPageRoutingModule
  ],
  declarations: [DetailModalMovilesPage]
})
export class DetailModalMovilesPageModule {}
