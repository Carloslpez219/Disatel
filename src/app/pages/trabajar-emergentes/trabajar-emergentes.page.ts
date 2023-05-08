import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SignaturePad } from 'angular2-signaturepad';
import { AlertService } from 'src/app/services/alert.service';
import { DisatelService } from 'src/app/services/disatel.service';
import { InstalarsimPage } from '../instalarsim/instalarsim.page';
import { LucesCkecklistPage } from '../luces-ckecklist/luces-ckecklist.page';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';
import { ModalSignPage } from '../modal-sign/modal-sign.page';

@Component({
  selector: 'app-trabajar-emergentes',
  templateUrl: './trabajar-emergentes.page.html',
  styleUrls: ['./trabajar-emergentes.page.scss'],
})
export class TrabajarEmergentesPage implements OnInit {

  @Input() vehiculo;
  @Input() orden;
  @Input() sims;
  @Input() equipos;
  @Input() equiposYaInstalados;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  viewEntered;
  // Estados de la orden
  sinIniciar = false;
  canceladaFallidaCompletada = false;
  observaciones = '';
  fechaHora;
  datosUsuario;
  preguntas;
  titulosImagenes;
  photo;
  fotos = Array(6);
  mostrarFoto = [false, false, false, false, false, false];
  photoFile = null;
  photosFile = Array(6);
  disabled = false;
  recibe = '';
  signaturePadOptions = {
    minWidth: 1,
    canvasWidth: 300,
    canvasHeight: 200,
    cancelable : false,
    backgroundColor : '#F7F7F6'
  };
  mostrarFirma = false;
  signFile = null;
  signature;
  // EQUIPOS Y SIM'S
  equiposASeleccionar = [];
  equiposInstalados = [];
  simsASeleccionar = [];
  spinner = true;

  constructor(private loadingController: LoadingController, private modalController: ModalController,
              private storage: Storage, private disatelService: DisatelService,
              private alertService: AlertService, private camera: Camera, private actionSheetController: ActionSheetController) {
              }


  async ionViewDidEnter() {
    this.evaluate();
    this.equiposSeleccionables(this.equipos);
    this.equiposSeleccionados(this.equiposYaInstalados);
    this.simsSeleccionables(this.sims);
    this.viewEntered = true;
    this.spinner = false;
    (await this.disatelService.getChecklistEmergentes(this.orden.ot)).subscribe((resp: any)=>{
      this.preguntas = resp.data;
    });
    (await this.disatelService.getTitulosImagenesEmergentes(this.orden.ot)).subscribe(async (resp: any) => {
      this.titulosImagenes = await resp.data;
    });
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  //Estados

  evaluate(){
    if(this.orden.situacion === '1'){
      this.sinIniciar = true;
      this.canceladaFallidaCompletada = false;
    }else if(this.orden.situacion === '2'){
      this.sinIniciar = false;
      this.canceladaFallidaCompletada = true;
    }
  }

  equiposSeleccionables(equipos){
    this.equiposASeleccionar = [];
    equipos.forEach(element => {
      this.equiposASeleccionar.push(element);
    });
  }

  equiposSeleccionados(equipos){
    this.equiposInstalados = [];
    equipos.forEach(element => {
      this.equiposInstalados.push(element);
    });
  }

  simsSeleccionables(sims){
    this.simsASeleccionar = [];
    sims.forEach(element => {
      this.simsASeleccionar.push(element);
    });
  }

  async ngOnInit() {
    this.datosUsuario = await this.storage.get('datos');
    this.loadingController.dismiss();
  }

  async back(){
    const obj = {
      orden: this.orden,
      vehiculo: this.vehiculo
    };
    this.modalController.dismiss(obj);
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

  async mostrarModalLuces() {
    if(this.recibe !== ''){
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      const luces = this.preguntas[0];
      const preguntas = this.preguntas;
      const orden = this.orden;
      const tipo = 'emergente';
      (await this.disatelService.iniciaChecklistEmergente(this.orden.ot, this.orden.vehiculo, this.recibe, this.fechaHora))
        .subscribe(async (resp: any) => {
          if(resp.status){
            const modal = await this.modalController.create({
              component: LucesCkecklistPage,
              backdropDismiss: false,
              componentProps: { luces, orden, preguntas, tipo}
            });
            await modal.present();
            const value: any = await modal.onDidDismiss();
            if(!value.data){
              this.disabled = true;
            }
          }else{
            this.alertService.presentToast(resp.message, 'danger', 3000);
          }
        });
    }else{
      this.alertService.presentAlert('Ningún campo debe estar vacío.');
    }

  }

  //Estados

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

    (await this.disatelService.iniciaOTEmergente(this.orden.ot, this.observaciones, this.fechaHora))
    .subscribe(async (resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 2500);
        this.viewEntered = false;
        (await this.disatelService.otEmergente(this.orden.ot, this.vehiculo.codigo))
        .subscribe(async (res: any) =>{
          this.orden = res.data[0];
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

  async finalizarTrabajo(){
    await this.presentLoading();
    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    (await this.disatelService.finOTEmergente(this.orden.ot, this.fechaHora))
      .subscribe((resp: any) =>{
        if(resp.status){
          this.alertService.presentToast(resp.message, 'success', 3000);
          this.modalController.dismiss(true);
        }else{
          this.alertService.presentToast(resp.message, 'danger', 3000);
        }
        this.loadingController.dismiss();
    });
  }

// EQUIPOS

  async seleccionar(eq){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    this.loadingController.dismiss();
    if(value.data !== undefined){
      this.spinner = true;
      this.observaciones = value.data;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();

    (await this.disatelService.seleccionarEquipoEmergente(this.orden.ot, this.vehiculo.codigo, eq.codigo, eq.imei, this.fechaHora, this.observaciones))
        .subscribe(async (resp: any)=>{
          if(resp.status){
            (await this.disatelService.getEquiposDisponibles()).subscribe(async (res: any) => {
              this.equiposSeleccionables(res.data);
            });
            (await this.disatelService.getEquiposInstaladosEmergentes(this.orden.ot)).subscribe(async (resp: any)=>{
              this.equiposSeleccionados(resp.data)
            });
            (await this.disatelService.getSimsDisponibles()).subscribe(async (res: any) => {
              this.simsSeleccionables(res.data);
            });
            this.alertService.presentToast(resp.message, 'success', 3000);
            setTimeout(() => {
              this.spinner = false;
            }, 500);
          }else{
            this.alertService.presentToast(resp.message, 'danger', 3000);
            this.spinner = false;
          }
        });
        this.loadingController.dismiss();
    }else{
      this.alertService.presentToast('Algo salió mal, intenta de nuevo.', 'danger', 3000);
    }
  }

  async desinstalarEquipo(eq){
    this.spinner = true;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();
        (await this.disatelService.deseleccionarEquipoE(this.orden.solicitud, eq.codigo,
          this.fechaHora))
          .subscribe(async (resp: any)=>{
            if(resp.status){
              (await this.disatelService.getEquiposDisponibles()).subscribe(async (res: any) => {
                this.equiposSeleccionables(res.data);
              });
              (await this.disatelService.getEquiposInstaladosEmergentes(this.orden.ot)).subscribe(async (resp: any)=>{
                this.equiposSeleccionados(resp.data)
              });
              this.alertService.presentToast(resp.message, 'success', 3000);
              setTimeout(() => {
                this.spinner = false;
              }, 500);
            }else{
              this.alertService.presentToast(resp.message, 'danger', 3000);
              this.spinner = false;
            }
          });        
        this.loadingController.dismiss();
  }

  async desintalacionEquipoActionSheet(eq) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desinstalar este equipo?',
      buttons: [{
        text: 'Aceptar',
        icon: 'checkmark-circle',
        handler: () => {
          this.desinstalarEquipo(eq);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  //SIM'S

  async seleccionarSim(sim){
    const equipos = this.equiposInstalados;
    const modal = await this.modalController.create({
      component: InstalarsimPage,
      backdropDismiss: false,
      componentProps: { equipos },
      cssClass: 'width-height'
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      this.spinner = true;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      let equipo;
      this.equiposInstalados.forEach(ele =>{
        if(ele.codigo === value.data){
          equipo = ele;
        }
      });
      if(equipo.sim !== ''){
        this.alertService.presentToast('Primero se debe desintalar la SIM que está instalada en este equipo.', 'danger', 5000);
      }else{
        (await this.disatelService.seleccionarSimEmergente(this.orden.ot, sim.codigo, this.fechaHora, equipo.codigo, equipo.linea))
          .subscribe(async (resp: any)=>{
            if(resp.status){
              (await this.disatelService.getSimsDisponibles()).subscribe(async (res: any) => {
                this.simsSeleccionables(res.data);
              });
              (await this.disatelService.getEquiposInstaladosEmergentes(this.orden.ot)).subscribe(async (resp: any)=>{
                this.equiposSeleccionados(resp.data);
              });
              setTimeout(() => {
                this.spinner = false;
              }, 500);
              this.alertService.presentToast(resp.message, 'success', 3000);
            }else{
              this.alertService.presentToast(resp.message, 'danger', 3000);
              this.spinner = false;
            }
          });
      }
    }
  }

  async desSeleccionarSim(eq){
    if(eq.sim != ''){
      this.spinner = true;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      (await this.disatelService.desinstalarSimE(this.orden.ot, eq.sim, this.fechaHora))
          .subscribe(async (res: any) =>{
            if(res.status){
              (await this.disatelService.getSimsDisponibles()).subscribe(async (res: any) => {
                this.simsSeleccionables(res.data);
              });
              (await this.disatelService.getEquiposInstaladosEmergentes(this.orden.ot)).subscribe(async (resp: any)=>{
                this.equiposSeleccionados(resp.data);
              });
              this.alertService.presentToast(res.message, 'success', 3000);
              setTimeout(() => {
                this.spinner = false;
              }, 500);
            }else{
              this.alertService.presentToast(res.message, 'danger', 3000);
              this.spinner = false;
            }
        });
    }else{
      this.alertService.presentToast('Este equipo no tiene ninguna sim instalada actualmente.', 'danger', 3000);
    }

  }

  async desintalacionSIMActionSheet(eq) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desinstalar este SIM?',
      buttons: [{
        text: 'Aceptar',
        icon: 'checkmark-circle',
        handler: () => {
          this.desSeleccionarSim(eq);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  //FOTOS

  async presentActionSheet(i) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Agregar foto',
      buttons: [{
        text: 'Cámara',
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
  (await this.disatelService.postFotoEmergentes(this.orden.ot, this.vehiculo.codigo, this.photoFile, i)).subscribe((resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 3000);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 3000);
      }
    });
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
    (await this.disatelService.postFotoEmergentes(this.orden.ot, this.vehiculo.codigo, this.photoFile, i)).subscribe((resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 3000);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 3000);
      }
    });
    }, (err) => {
      console.log(err);
    });
  }

  async mostrarModalSign() {
    const modal = await this.modalController.create({
      component: ModalSignPage,
      cssClass: 'width-height2',
      backdropDismiss: false
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    this.signature = value.data;
    this.signFile = this.dataURLtoFile(this.signature, 'sign.png');
    this.mostrarFirma = true;
    (await this.disatelService.postFirmaEmergente(this.orden.solicitud, this.vehiculo.codigo, this.signFile)).subscribe((resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 3000);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 3000);
      }
    });
  }

}
