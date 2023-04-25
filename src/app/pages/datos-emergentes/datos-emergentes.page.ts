import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertService } from 'src/app/services/alert.service';
import { DisatelService } from 'src/app/services/disatel.service';
import { ObservacionesPage } from '../observaciones/observaciones.page';
import { TrabajarEmergentesPage } from '../trabajar-emergentes/trabajar-emergentes.page';
import { TrabajarVehiculoPage } from '../trabajar-vehiculo/trabajar-vehiculo.page';
import { VerDatosPage } from '../ver-datos/ver-datos.page';
import { VerSIMPage } from '../ver-sim/ver-sim.page';

@Component({
  selector: 'app-datos-emergentes',
  templateUrl: './datos-emergentes.page.html',
  styleUrls: ['./datos-emergentes.page.scss'],
})
export class DatosEmergentesPage implements OnInit {

  @Input() orden;
  @Input() equiposDisponibles;
  @Input() simsDisponibles;
  viewEntered = false;
  recharge;
  fechaHora;
  datosUsuario;
  observaciones = '';

  constructor(private modalController: ModalController, public loadingController: LoadingController,
    private disatelService: DisatelService, private alertService: AlertService, private storage: Storage, 
    private actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    // this.ordenesDeTrabajo = await this.storage.get('ordenes') || [];
    this.datosUsuario = await this.storage.get('datos');
  }

  async ionViewDidEnter() {
    this.loadingController.dismiss();
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.recharge = false;
    this.modalController.dismiss(this.recharge);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
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

  async mostrarModalObservaciones( observaciones ) {
    if(observaciones.length === 0){
      this.alertService.presentAlert('No hay comentarios ni observaciones.');
    }else{
      await this.presentLoading();
      const modal = await this.modalController.create({
        component: ObservacionesPage,
        backdropDismiss: false,
        componentProps: { observaciones }
      });
      await modal.present();
    }
  }

  async mostrarModalVehiculo( vehiculo, orden ) {
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: TrabajarVehiculoPage,
      backdropDismiss: false,
      componentProps: { vehiculo, orden}
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
}

async mostrarModalSim( sim ) {
  await this.presentLoading();
  const modal = await this.modalController.create({
    component: VerSIMPage,
    backdropDismiss: false,
    componentProps: { sim }
  });
  await modal.present();
}

async mostrarModalEquipo( equipo ) {
  await this.presentLoading();
  const modal = await this.modalController.create({
    component: VerDatosPage,
    backdropDismiss: false,
    componentProps: { equipo }
  });
  await modal.present();
}

async presentActionSheet(vehiculo, orden) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Seleccione una opción',
    buttons: [{
      text: 'Ver detalles',
      icon: 'list-outline',
      handler: () => {
        this.mostrarModalVehiculo(vehiculo, orden);
      }
    }, {
      text: 'Trabajar vehiculo',
      icon: 'clipboard-outline',
      handler: () => {
        this.trabajarVehiculo(vehiculo, orden);
      }
    },{
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    }]
  });
  await actionSheet.present();
}

async trabajarVehiculo(vehiculo, orden) {
  const sims = this.simsDisponibles;
  const equipos = this.equiposDisponibles;
  if(this.orden[0].status_codigo !== 4 && this.orden[0].vehiculos[0].situacion_trabajo !== 1){
    (await this.disatelService.getEquiposInstaladosEmergentes(orden.ot)).subscribe(async (resp: any)=>{
        const equiposYaInstalados = resp.data;
        await this.presentLoading();
        const modal = await this.modalController.create({
          component: TrabajarEmergentesPage,
          backdropDismiss: false,
          componentProps: { vehiculo, orden, sims, equipos, equiposYaInstalados}
        });
        await modal.present();

        const value: any = await modal.onDidDismiss();
        if(value.data === true){
          this.modalController.dismiss(true);
        }else{
          this.orden[0] = value.data.orden;
          this.orden[0].vehiculos[0] = value.data.vehiculo;
        }
    });
  }else{
    this.alertService.presentAlert('Para trabajar el vehículo, debe presentar ubicación e iniciar el trabajo.');
  }
}


}
