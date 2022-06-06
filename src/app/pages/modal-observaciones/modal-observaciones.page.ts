import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DisatelService } from '../../services/disatel.service';
import { Platform } from '@ionic/angular';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-modal-observaciones',
  templateUrl: './modal-observaciones.page.html',
  styleUrls: ['./modal-observaciones.page.scss'],
})
export class ModalObservacionesPage implements OnInit {

  observaciones = '';
  viewEntered;

  constructor(private modalController: ModalController, private disatelService: DisatelService,
              private loadingController: LoadingController, private platform: Platform, private alertService: AlertService) { }

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }


  ngOnInit() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 400);
  }

  async back(){
    this.modalController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  aceptar(){
    this.modalController.dismiss(this.observaciones);
  }

}
