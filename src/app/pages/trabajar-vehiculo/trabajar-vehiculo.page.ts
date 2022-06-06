import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DisatelService } from '../../services/disatel.service';
import { AlertService } from '../../services/alert.service';
import { Platform } from '@ionic/angular';
import { TravajarVehiculoOpPage } from '../travajar-vehiculo-op/travajar-vehiculo-op.page';
import { ChecklistPage } from '../checklist/checklist.page';

@Component({
  selector: 'app-trabajar-vehiculo',
  templateUrl: './trabajar-vehiculo.page.html',
  styleUrls: ['./trabajar-vehiculo.page.scss'],
})
export class TrabajarVehiculoPage implements OnInit {

  @Input() vehiculo;
  @Input() orden;
  atras: boolean;
  fechaHora;
  viewEntered;

  constructor(private modalController: ModalController, private storage: Storage,
              private disatelService: DisatelService, private alertService: AlertService, private loadingController: LoadingController,
              private platform: Platform, public toastController: ToastController) {
    this.atras = true;
  }

  ionViewDidEnter() {
    this.viewEntered = true;
    console.log(this.orden);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  ngOnInit() {
      this.loadingController.dismiss();
  }

  async back(){
    this.atras = true;
    this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss(this.atras);
    });
    this.modalController.dismiss(this.atras);
  }

  getDate(){
    let todayDate;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    todayDate = dd + '/' + mm + '/' + yyyy;
    return todayDate;
  }

  getHour(){
    const hoy = new Date();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    return hora;
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  async trabajarVehiculo() {
    const vehiculo = await this.vehiculo;
    const orden = await this.orden;
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: TravajarVehiculoOpPage,
      backdropDismiss: false,
      componentProps: { vehiculo, orden}
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    console.log(value);
}

async mostrarChecklist(){
  const orden = this.orden;
  const vehiculo = this.vehiculo;
  const modal = await this.modalController.create({
    component: ChecklistPage,
    backdropDismiss: false,
    componentProps: { orden, vehiculo }
  });
  await modal.present();
}

proceed(){
  if(this.orden.checklist){
    this.mostrarChecklist();
  }else{
    this.trabajarVehiculo();
  }
}

}
