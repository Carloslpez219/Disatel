import { ModalController, Platform } from '@ionic/angular';
import { DisatelService } from './../../services/disatel.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.page.html',
  styleUrls: ['./accesorios.page.scss'],
})
export class AccesoriosPage implements OnInit {

  @Input() orden;
  accesorios;
  viewEntered;

  constructor( private disatelService: DisatelService, private modalController: ModalController, private platform: Platform) { }

  ionViewDidEnter() {
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async ngOnInit() {
    (await this.disatelService.getAccesorios(this.orden.solicitud, this.orden.vehiculo)).subscribe((resp: any) =>{
      this.accesorios = resp.data;
      this.viewEntered = true;
    });
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

}
