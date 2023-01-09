import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-trabajar-vehiculo',
  templateUrl: './trabajar-vehiculo.page.html',
  styleUrls: ['./trabajar-vehiculo.page.scss'],
})
export class TrabajarVehiculoPage implements OnInit {

  @Input() vehiculo;
  @Input() orden;
  viewEntered;

  constructor(private modalController: ModalController, private platform: Platform, public loadingController: LoadingController) {
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    this.loadingController.dismiss();
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  ngOnInit() {
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

}
