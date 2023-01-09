import { ObservacionesPage } from './../observaciones/observaciones.page';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-moviles',
  templateUrl: './datos-moviles.page.html',
  styleUrls: ['./datos-moviles.page.scss'],
})
export class DatosMovilesPage implements OnInit {

  @Input() dispositivo;
  viewEntered = false;
  recharge;
  datosUsuario;

  constructor(private loadingController: LoadingController, private platform: Platform,  private modalController: ModalController,
              private storage: Storage) { }

  async ionViewDidEnter() {
    this.loadingController.dismiss();
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.recharge = false;
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss(this.recharge);
    });
    this.modalController.dismiss(this.recharge);
  }

  async ngOnInit() {
    this.datosUsuario = await this.storage.get('datos');
  }

  async mostrarModalObservaciones( observaciones ) {
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ObservacionesPage,
      backdropDismiss: false,
      componentProps: { observaciones }
    });
    await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  verDispositivo(dispositivo){
  }

  cancelarEntrega(){
  }


}
