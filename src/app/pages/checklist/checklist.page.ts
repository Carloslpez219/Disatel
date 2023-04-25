import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { LucesCkecklistPage } from '../luces-ckecklist/luces-ckecklist.page';
import { InteriorCkecklistPage } from '../interior-ckecklist/interior-ckecklist.page';
import { GeneralCkecklistPage } from '../general-ckecklist/general-ckecklist.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TravajarVehiculoOpPage } from '../travajar-vehiculo-op/travajar-vehiculo-op.page';
import { DataSyncService } from '../../services/data-sync.service';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {

  @Input() orden;
  @Input() vehiculo;
  viewEntered;
  photo;
  fotos = Array(6);
  mostrarFoto = [false, false, false, false, false, false];
  photoFile = null;
  photosFile = Array(6);
  contador = 0;
  recibe = ' ';
  fechaHora;
  //Respuestas
  respuestasLuces;
  respuestasInteriores;
  respuestasGenerales;
  datosUsuario;

  constructor(private camera: Camera, private platform: Platform, private modalController: ModalController,
              private loadingController: LoadingController, public actionSheetController: ActionSheetController,
              private storage: Storage, private dataSyncService: DataSyncService) {
              }

  ionViewDidEnter() {
    setTimeout(() => {
      this.viewEntered = true;
    }, 100);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }


  async ngOnInit() {
    this.datosUsuario = await this.storage.get('datos');
  }

  async presentActionSheet(i) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Foto',
      buttons: [{
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          this.takePicture(i);
        }
      }, {
        text: 'Galería',
        icon: 'image',
        handler: () => {
          this.openGallery(i);
        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

  async mostrarModalLuces() {

    const luces = this.orden.preguntas.luces.preguntas;
    const orden = this.orden;

    const modal = await this.modalController.create({
      component: LucesCkecklistPage,
      backdropDismiss: false,
      componentProps: { luces, orden }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    this.respuestasLuces = value.data;
    this.orden.preguntas.luces.respuestas = await this.respuestasLuces;

    await this.storage.set(this.orden.codigo, this.orden );
  }

  async mostrarModalInterior() {

    const interiores = this.orden.preguntas.interiores.preguntas;
    const orden = this.orden;

    const modal = await this.modalController.create({
      component: InteriorCkecklistPage,
      backdropDismiss: false,
      componentProps: { interiores, orden }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    this.respuestasInteriores = value.data;
    this.orden.preguntas.interiores.respuestas = await this.respuestasInteriores;

    await this.storage.set(this.orden.codigo, this.orden );
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

  async mostrarModalGenral() {

    const general = this.orden.preguntas.general.preguntas;
    const orden = this.orden;

    const modal = await this.modalController.create({
      component: GeneralCkecklistPage,
      backdropDismiss: false,
      componentProps: { general, orden }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    this.respuestasGenerales = value.data;
    this.orden.preguntas.general.respuestas = await this.respuestasGenerales;

    await this.storage.set(this.orden.codigo, this.orden );
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
}

  async enviar(){

    this.fechaHora = await this.getDate() + ' ' + this.getHour();

    // eslint-disable-next-line max-len
    await this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=finaliza_checklist&ot=${this.orden.codigo}&vehiculo=${this.vehiculo.codigo}&entrega=${this.recibe}&usuario=${this.datosUsuario.codigo}&fecha_hora=${this.fechaHora}`);
    this.orden.checklist = await false;
    await this.storage.set(this.orden.codigo, this.orden );
    await this.modalController.dismiss();
    await this.trabajarVehiculo();
  }

  dataURLtoFile(dataurl, filename) {
    // tslint:disable-next-line: one-variable-per-declaration
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

async takePicture(i) {
  const options: CameraOptions = {
    quality: 70,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: false,
    correctOrientation: true
  };

  this.camera.getPicture(options).then(async (imageData) => {
  const base64Image = 'data:image/jpeg;base64,' + imageData;
  this.photo = base64Image;
  this.photoFile = await this.dataURLtoFile(this.photo, 'Foto');
  this.fotos[i] = this.photo;
  this.photosFile [i] = this.photoFile;
  this.mostrarFoto[i] = true;
  }, (err) => {
    console.log(err);
  });
}

openGallery(i) {
  const galleryOptions: CameraOptions = {
    quality: 70,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: false,
    correctOrientation: true
    };

  this.camera.getPicture(galleryOptions).then(async (imgData) => {
    const base64Image = 'data:image/jpeg;base64,' + imgData;
    this.photo = base64Image;
    this.photoFile = await this.dataURLtoFile(this.photo, 'Foto');
    this.fotos[i] = this.photo;
    this.photosFile [i] = this.photoFile;
    this.mostrarFoto[i] = true;
    }, (err) => {
      console.log(err);
    });
  }

}
