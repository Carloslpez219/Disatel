import { InstalarsimPage } from './../instalarsim/instalarsim.page';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from './../../services/alert.service';
import { DisatelService } from './../../services/disatel.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, Platform, ModalController, ActionSheetController } from '@ionic/angular';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';
import { Storage } from '@ionic/storage';
import { LucesCkecklistPage } from '../luces-ckecklist/luces-ckecklist.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AccesoriosPage } from '../accesorios/accesorios.page';
import { SignaturePad } from 'angular2-signaturepad';
import { ModalSignPage } from '../modal-sign/modal-sign.page';

@Component({
  selector: 'app-travajar-vehiculo-op',
  templateUrl: './travajar-vehiculo-op.page.html',
  styleUrls: ['./travajar-vehiculo-op.page.scss'],
})
export class TravajarVehiculoOpPage implements OnInit {

  @Input() vehiculo;
  @Input() orden;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  viewEntered;
  // Estados de la orden
  sinIniciar = false;
  canceladaFallidaCompletada = false;
  completada = false;
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
  visitForm: FormGroup;
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
  equiposAnteriores = [];
  instalacion;
  spinner = true;

  constructor(private loadingController: LoadingController, private platform: Platform, private modalController: ModalController,
              private storage: Storage, private disatelService: DisatelService,
              private alertService: AlertService, private camera: Camera, private actionSheetController: ActionSheetController) {
                this.visitForm = this.createFormGroup();
              }

  //FORM

  createFormGroup() {
    return new FormGroup({
      recibeVisita: new FormControl('', [Validators.required]),
      reporte: new FormControl('', [Validators.required]),
      encontrado: new FormControl('', [Validators.required]),
      solucion: new FormControl(''),
      observacionesAlCliente: new FormControl(''),
      observacionesInternas: new FormControl('')
    });
  }

  get recibeVisita() { return this.visitForm.get('recibeVisita'); }
  get reporte() { return this.visitForm.get('reporte'); }
  get encontrado() { return this.visitForm.get('encontrado'); }
  get solucion() { return this.visitForm.get('solucion'); }
  get observacionesAlCliente() { return this.visitForm.get('observacionesAlCliente'); }
  get observacionesInternas() { return this.visitForm.get('observacionesInternas'); }

  //

  async ionViewDidEnter() {
    this.evaluate();
    (await this.disatelService.getEquiposInstalados(this.orden.solicitud, this.vehiculo.codigo)).subscribe((resp: any)=>{
      this.equiposSeleccionados(resp.data);
    });
    (await this.disatelService.getEquiposAIstalar(this.orden.solicitud)).subscribe((resp: any)=>{
      console.log(resp.data);
      this.equiposSeleccionables(resp.data);
    });
    (await this.disatelService.equiposAnteriormenteInstalados(this.vehiculo.codigo, this.orden.solicitud)).subscribe((resp: any)=>{
      this.equiposAnteriormente(resp.data);
    });
    this.viewEntered = true;
    (await this.disatelService.getCheclist()).subscribe((resp: any)=>{
      this.preguntas = resp.data;
    });
    (await this.disatelService.getTitulosImagenes()).subscribe(async (resp: any) => {
      this.titulosImagenes = await resp.data;
    });
    (await this.disatelService.getSims(this.orden.solicitud)).subscribe(async (resp: any) => {
      this.simsSeleccionables(resp.data);
    });
    setTimeout(() => {
      this.spinner = false;
    }, 500);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  //Estados

  evaluate(){
    if(this.vehiculo.situacion_trabajo === 1){
      this.sinIniciar = true;
      this.canceladaFallidaCompletada = false;
      this.completada = false;
    }else if(this.vehiculo.situacion_trabajo === 2){
      this.sinIniciar = false;
      this.canceladaFallidaCompletada = true;
      this.completada = false;
    }else if(this.vehiculo.situacion_trabajo === 3){
      this.completada = true;
      this.sinIniciar = false;
      this.canceladaFallidaCompletada = false;
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

  equiposAnteriormente(equipos){
    this.equiposAnteriores = [];
    equipos.forEach(element => {
      this.equiposAnteriores.push(element);
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
    if(this.orden.trabajo_tecnico === 1){
      this.instalacion = false;
    }else{
      this.instalacion = true;
    }
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
      const tipo = 'normal';
      (await this.disatelService.iniciaChecklist(this.orden.solicitud, this.orden.vehiculo, this.recibe, this.fechaHora))
        .subscribe(async (resp: any) => {
          if(resp.status){
            const modal = await this.modalController.create({
              component: LucesCkecklistPage,
              backdropDismiss: false,
              componentProps: { luces, orden, preguntas, tipo }
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

  async mostrarModalAccesorios(){
    const orden = this.orden;

    const modal = await this.modalController.create({
      component: AccesoriosPage,
      backdropDismiss: false,
      componentProps: {orden}
    });
    await modal.present();
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

    (await this.disatelService.iniciarVehículo(this.orden.solicitud, this.vehiculo.codigo, this.observaciones, this.fechaHora))
    .subscribe(async (resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 2500);
        this.viewEntered = false;
        (await this.disatelService.getVehiculo(this.orden.vehiculos[0].codigo, this.orden.solicitud))
        .subscribe(async (res: any) =>{
          this.vehiculo = res.data;
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
    if(this.instalacion){
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
  
        (await this.disatelService.finalizaVisita(this.orden.solicitud, this.visitForm.value.reporte, this.visitForm.value.encontrado,
          this.visitForm.value.solucion, this.visitForm.value.observacionesAlCliente,
          this.visitForm.value.recibeVisita, this.visitForm.value.observacionesInternas, this.fechaHora, this.vehiculo.codigo))
          .subscribe((resp: any) =>{
            if(resp){
              this.alertService.presentToast(resp.message, 'success', 2500);
              this.modalController.dismiss(true);
            }else{
              this.alertService.presentToast(resp.message, 'danger', 2500);
            }
            this.loadingController.dismiss();
          });
      }
    }else{
      this.alertService.presentAlert('Para finalizar el trabajo primero debe de instalar un equipo.')
    }
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

    (await this.disatelService.seleccionarEquipo(this.orden.solicitud, this.vehiculo.codigo, eq.equipo, this.fechaHora, this.observaciones))
        .subscribe(async (resp: any)=>{
          if(resp.status){
            (await this.disatelService.getEquiposInstalados(this.orden.solicitud, this.vehiculo.codigo)).subscribe((resp: any)=>{
              this.equiposSeleccionados(resp.data);
            });
            (await this.disatelService.getEquiposAIstalar(this.orden.solicitud)).subscribe((resp: any)=>{
              this.equiposSeleccionables(resp.data);
            });
            (await this.disatelService.equiposAnteriormenteInstalados(this.vehiculo.codigo, this.orden.solicitud)).subscribe((resp: any)=>{
              this.equiposAnteriormente(resp.data);
            });
            (await this.disatelService.getSims(this.orden.solicitud)).subscribe(async (res: any) => {
              this.simsSeleccionables(res.data);
            });
            this.alertService.presentToast(resp.message, 'success', 3000);
            this.instalacion = true;
            setTimeout(() => {
              this.spinner = false;
            }, 500);
          }else{
            this.alertService.presentToast(resp.message, 'danger', 3000);
          }
        });
    }
  }

  async desinstalarEquipo(eq, tipo){
    let solicitud = '';
    if(tipo === ''){
      solicitud = this.orden.solicitud;
    }else{
      solicitud = eq.solicitud;
    }
    this.spinner = true;
    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    (await this.disatelService.getEquipo(solicitud, eq.codigo)).subscribe(async (res: any) =>{
      if(res.status){
        (await this.disatelService.deseleccionarEquipo(this.orden.solicitud, this.vehiculo.codigo, eq.codigo,
          this.fechaHora, res.data[0].despacho))
          .subscribe(async (resp: any)=>{
            if(resp.status){
              (await this.disatelService.getEquiposInstalados(this.orden.solicitud, this.vehiculo.codigo)).subscribe((resp: any)=>{
                this.equiposSeleccionados(resp.data);
              });
              (await this.disatelService.getEquiposAIstalar(this.orden.solicitud)).subscribe((resp: any)=>{
                this.equiposSeleccionables(resp.data);
              });
              (await this.disatelService.equiposAnteriormenteInstalados(this.vehiculo.codigo, this.orden.solicitud)).subscribe((resp: any)=>{
                this.equiposAnteriormente(resp.data);
              });
              this.alertService.presentToast(resp.message, 'success', 3000);
            }else{
              this.alertService.presentToast(resp.message, 'danger', 3000);
            }
          });
          setTimeout(() => {
            this.spinner = false;
          }, 500);
      }else{
        this.spinner = false;
        this.alertService.presentToast(res.message, 'danger', 3000);
      }
    });

  }

  async desintalacionEquipoActionSheet(eq, tipo) {
    const actionSheet = await this.actionSheetController.create({
      header: '¿Desinstalar este equipo?',
      buttons: [{
        text: 'Aceptar',
        icon: 'checkmark-circle',
        handler: () => {
          this.desinstalarEquipo(eq, tipo);
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
    const equipos = this.equiposInstalados.concat(this.equiposAnteriores);
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
      this.equiposInstalados.concat(this.equiposAnteriores).forEach(ele =>{
        if(ele.codigo === value.data){
          equipo = ele;
        }
      });
      if(equipo.sim !== ''){
        this.alertService.presentToast('Primero se debe desintalar la SIM que está instalada en este equipo.', 'danger', 5000);
      }else{
        (await this.disatelService.seleccionarSim(this.orden.solicitud, this.vehiculo.codigo, sim.codigo, this.fechaHora, equipo.codigo))
          .subscribe(async (resp: any)=>{
            if(resp.status){
              (await this.disatelService.getSims(this.orden.solicitud)).subscribe(async (res: any) => {
                this.simsSeleccionables(res.data);
              });
              (await this.disatelService.getEquiposInstalados(this.orden.solicitud, this.vehiculo.codigo)).subscribe((resp: any)=>{
                this.equiposSeleccionados(resp.data);
              });
              (await this.disatelService.equiposAnteriormenteInstalados(this.vehiculo.codigo, this.orden.solicitud)).subscribe((resp: any)=>{
                this.equiposAnteriormente(resp.data);
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
          (await this.disatelService.desinstalarSim(this.orden.solicitud, this.vehiculo.codigo, eq.sim , this.fechaHora))
              .subscribe(async (res: any) =>{
                if(res.status){
                  (await this.disatelService.getSims(this.orden.solicitud)).subscribe(async (respo: any) => {
                    this.simsSeleccionables(respo.data);
                    eq.sim = '';
                    (await this.disatelService.getEquiposInstalados(this.orden.solicitud, this.vehiculo.codigo)).subscribe((resp: any)=>{
                      this.equiposSeleccionados(resp.data);
                    });
                    (await this.disatelService.getEquiposAIstalar(this.orden.solicitud)).subscribe((resp: any)=>{
                      this.equiposSeleccionables(resp.data);
                    });
                    (await this.disatelService.equiposAnteriormenteInstalados(this.vehiculo.codigo, this.orden.solicitud)).subscribe((resp: any)=>{
                      this.equiposAnteriormente(resp.data);
                    });
                  });
                  this.alertService.presentToast(res.message, 'success', 3000);
                  setTimeout(() => {
                    this.spinner = false;
                  }, 500);
                }else{
                  this.alertService.presentToast(res.message, 'danger', 3000);
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
  (await this.disatelService.postFoto(this.orden.solicitud, this.vehiculo.codigo, this.photoFile, i)).subscribe((resp: any)=>{
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
    (await this.disatelService.postFoto(this.orden.solicitud, this.vehiculo.codigo, this.photoFile, i)).subscribe((resp: any)=>{
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
    (await this.disatelService.postFirma(this.orden.solicitud, this.vehiculo.codigo, this.signFile)).subscribe((resp: any)=>{
      if(resp.status){
        this.alertService.presentToast(resp.message, 'success', 3000);
      }else{
        this.alertService.presentToast(resp.message, 'danger', 3000);
      }
    });
  }

}
