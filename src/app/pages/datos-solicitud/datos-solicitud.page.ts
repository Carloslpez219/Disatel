import { TravajarVehiculoOpPage } from './../travajar-vehiculo-op/travajar-vehiculo-op.page';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { DisatelService } from 'src/app/services/disatel.service';
import { AlertService } from 'src/app/services/alert.service';
import { ObservacionesPage } from '../observaciones/observaciones.page';
import { TrabajarVehiculoPage } from '../trabajar-vehiculo/trabajar-vehiculo.page';
import { VerSIMPage } from '../ver-sim/ver-sim.page';
import { VerDatosPage } from '../ver-datos/ver-datos.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataSyncService } from '../../services/data-sync.service';
import { Storage } from '@ionic/storage';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';

@Component({
  selector: 'app-datos-solicitud',
  templateUrl: './datos-solicitud.page.html',
  styleUrls: ['./datos-solicitud.page.scss'],
})
export class DatosSolicitudPage implements OnInit {

  @Input() orden;
  viewEntered = false;
  recharge;
  longitude;
  latitude;
  fechaHora;
  datosUsuario;
  observaciones = '';
  // Estados de la orden
  enCurso = false;
  presentarUbicacion = false;
  completada = false;
  ordenesDeTrabajo;
  canceladaFallida = false;
  iniciar = false;

  constructor(private platform: Platform, private modalController: ModalController, public loadingController: LoadingController,
              private disatelService: DisatelService, private geolocation: Geolocation, private dataSyncService: DataSyncService,
              private alertService: AlertService, private storage: Storage, private actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    // this.ordenesDeTrabajo = await this.storage.get('ordenes') || [];
    this.datosUsuario = await this.storage.get('datos');
    console.log(this.orden);
  }

  async ionViewDidEnter() {
      this.loadingController.dismiss();
      this.viewEntered = true;
      this.evaluate();
  }

  evaluate(){
    if(this.orden[0].status_codigo === 4){
      this.presentarUbicacion = true;
      this.enCurso = false;
      this.completada = false;
    }else if(this.orden[0].status_codigo === 5){
      this.enCurso = true;
      this.presentarUbicacion = false;
      this.completada = false;
    }else if(this.orden[0].status_codigo === 10){
      this.enCurso = false;
      this.presentarUbicacion = false;
      this.completada = true;
    }
    if(this.orden[0].vehiculos[0].situacion_trabajo === 1 && this.orden[0].status_codigo === 5){
      this.iniciar = true;
      this.canceladaFallida = false;
    }else if(this.orden[0].vehiculos[0].situacion_trabajo === 2 && this.orden[0].status_codigo === 5){
      this.iniciar = false;
      this.canceladaFallida = true;
    }else if(this.orden[0].vehiculos[0].situacion_trabajo === 3 && this.orden[0].status_codigo !== 4){
      this.iniciar = false;
      this.canceladaFallida = false;
    }
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
    console.log(value);
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

getPosition(){
  this.geolocation.getCurrentPosition().then(async (resp) => {
    this.latitude = await resp.coords.latitude;
    this.longitude = await resp.coords.longitude;
    console.log(resp);
  }).catch((error) => {
    this.alertService.presentToast(error, 'danger', 3000);
  });
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
      text: 'Trabajar vehículo',
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
  if(this.orden[0].status_codigo !== 4 && this.orden[0].vehiculos[0].situacion_trabajo !== 1){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: TravajarVehiculoOpPage,
      backdropDismiss: false,
      componentProps: { vehiculo, orden}
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      setTimeout(() => { 
        this.modalController.dismiss(true);
      }, 200);
    }
  }else{
    this.alertService.presentAlert('Para trabajar el vehículo, debe presentar ubicación e iniciar el trabajo.');
  }
}

// ESTADOS DE LA ORDEN

async cancelarTrabajo(){
  await this.presentLoading();
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    backdropDismiss: false
  });
  await modal.present();
  const value: any = await modal.onDidDismiss();
  if(value.data !== undefined){
    this.observaciones = value.data;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();

    (await this.disatelService.cancelarVehículo(this.orden[0].solicitud, this.orden[0].vehiculo, this.observaciones, this.fechaHora))
    .subscribe(async (resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 2500);
        this.viewEntered = false;
        this.loadingController.dismiss();
        this.modalController.dismiss(true);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 2500);
      }
    });
    this.loadingController.dismiss();
    this.modalController.dismiss(true);
  }
}

async trabajoFallido(){
  await this.presentLoading();
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    backdropDismiss: false
  });
  await modal.present();
  const value: any = await modal.onDidDismiss();
  if(value.data !== undefined){
    this.observaciones = value.data;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();

    (await this.disatelService.fallidoVehículo(this.orden[0].solicitud, this.orden[0].vehiculo, this.observaciones, this.fechaHora))
    .subscribe(async (resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 2500);
        this.viewEntered = false;
        this.loadingController.dismiss();
        this.modalController.dismiss(true);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 2500);
      }
    });
  }
}

async iniciarTrabajo(){
  await this.presentLoading();
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    backdropDismiss: false
  });
  await modal.present();
  const value: any = await modal.onDidDismiss();
  if(value.data !== undefined){
    this.observaciones = value.data;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();

    (await this.disatelService.iniciarVehículo(this.orden[0].solicitud, this.orden[0].vehiculo, this.observaciones, this.fechaHora))
    .subscribe(async (resp: any)=>{
      console.log(resp);
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 2500);
        this.viewEntered = false;
        (await this.disatelService.getOrdenTrabajo(this.orden[0].vehiculos[0].codigo, this.orden[0].solicitud))
        .subscribe(async (res: any) =>{
          this.orden = res.data;
          this.evaluate();
          this.viewEntered = true;
        });
      }else{
        this.alertService.presentToast(resp.message, 'danger', 2500);
      }
    });
    this.loadingController.dismiss();
  }
}

async ubicacion(){
  await this.presentLoading();
  this.getPosition();
  const modal = await this.modalController.create({
    component: ModalObservacionesPage,
    backdropDismiss: false
  });
  await modal.present();
  const value: any = await modal.onDidDismiss();
  if(value.data !== undefined){
    this.observaciones = value.data;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    (await this.disatelService.presente(this.orden[0].solicitud, this.orden[0].vehiculos[0].codigo, this.observaciones, this.fechaHora,
      this.longitude, this.latitude)).subscribe(async (resp: any)=>{
        console.log(resp);
        if(resp.status){
          this.alertService.presentToast(resp.message, 'success', 3500);
          this.viewEntered = false;
          (await this.disatelService.getOrdenTrabajo(this.orden[0].vehiculos[0].codigo, this.orden[0].solicitud))
          .subscribe(async (res: any) =>{
            console.log(res);
            this.orden = res.data;
            this.evaluate();
            this.viewEntered = true;
          });
        }else{
          this.alertService.presentToast(resp.message, 'danger', 2500);
        }
    });
    this.loadingController.dismiss();
  }
}

}
