import { DatosMovilesPage } from './../datos-moviles/datos-moviles.page';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Data, RootObject } from 'src/app/interfaces/Data';
import { DisatelService } from 'src/app/services/disatel.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { DatosSolicitudPage } from '../datos-solicitud/datos-solicitud.page';
import { HttpClient } from '@angular/common/http';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { OTEmergentePage } from '../ot-emergente/ot-emergente.page';
import { DatosEmergentesPage } from '../datos-emergentes/datos-emergentes.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Skeleton view
  cardSkeleton: boolean;
  skeletonScreen = Array(3);
  //Datos de trabajo
  ordenesDeTrabajo;
  //Validadción data
  noData;
  rutas;
  //
  ordenes = true;
  dispositivos = false;
  emergentes = false;
  segmento = 'ordenes';

  constructor(private storage: Storage, private disatelService: DisatelService, private userService: UserService, private router: Router,
              private alertService: AlertService, private modalController: ModalController, public loadingController: LoadingController,
              private http: HttpClient, private navCtrl: NavController) {
    this.cardSkeleton = true;
  }

  async ionViewWillEnter() {
    this.getData('V');
    this.rutas = await this.storage.get('rutas') || [];
  }

  async getOrdenesTrabajo <T>(datosUsuario, tipo) {
      const isOnLine = navigator.onLine;
      if (isOnLine){
        try {
          (await this.disatelService.getOrdenesTrabajo(datosUsuario.codigo, tipo)).subscribe(async (resp: RootObject) => {
            if(resp){
              this.ordenesDeTrabajo = resp.data;
              console.log(this.ordenesDeTrabajo);
              if (this.ordenesDeTrabajo.length === 0){
                this.noData = true;
              }else{
                this.noData = false;
                this.cardSkeleton = false;
                /*
                await this.ordenesDeTrabajo.forEach(async element => {
                  (await this.disatelService.getOrdenTrabajo(element.vehiculo, element.solicitud)).subscribe(async (res: any) => {
                    console.log(res);
                    res.data[0].equiposAsignados = [];
                    res.data[0].simsAsignados = [];
                    res.data[0].preguntas = {
                        interiores : {
                          preguntas: [],
                          respuestas: [],
                        },
                        luces : {
                          preguntas: [],
                          respuestas: [],
                        },
                        general : {
                          preguntas: [],
                          respuestas: [],
                        }
                      };
                      res.data[0].titulosImagenes = [];
                      res.data[0] .checklist = true;
                  });
                });
                */
                // await this.storage.set('ordenes', this.ordenesDeTrabajo);
              }
            }else{
              this.alertService.presentAlert('Ha ocurrido un error en el servidor, intenténtalo de nuevo más tarde.');
            }
          });
        } catch (error) {
          this.alertService.presentAlert('Ha ocurrido un error en el servidor. Intente de nuevo más tarde.');
        }
      }else{
        this.ordenesDeTrabajo = await this.storage.get('ordenes') || [];
        if (this.ordenesDeTrabajo.length === 0){
          this.noData = true;
        }else{
          this.noData = false;
        }
        this.cardSkeleton = false;
      }
  }

  async getData(tipo) {
    const datosUsuario = await this.storage.get('datos');
    if (datosUsuario) {
      this.getOrdenesTrabajo(datosUsuario, tipo);
    }
  }

  async getDataEmergentes() {
    const datosUsuario = await this.storage.get('datos');
    (await this.disatelService.getOrdenesTrabajoEspeciales(datosUsuario.codigo)).subscribe(async (resp: RootObject) => {
      if(resp){
        this.ordenesDeTrabajo = resp.data;
        console.log(this.ordenesDeTrabajo);
        if (this.ordenesDeTrabajo.length === 0){
          this.noData = true;
        }else{
          this.noData = false;
          this.cardSkeleton = false;
        }
      }else{
        this.alertService.presentAlert('Ha ocurrido un error en el servidor, intenténtalo de nuevo más tarde.');
      }
    });
  }

  async logOut(){
    this.router.navigateByUrl('/login');
    this.storage.remove('datos');
    this.storage.remove('ordenes');
    this.storage.clear();
  }

  async mostrarModal( codigo, solicitud ){
    await this.presentLoading();
    //const ordenEsecifica = await this.storage.get(codigo);
    (await this.disatelService.getOrdenTrabajo(codigo, solicitud)).subscribe(async (resp: any) =>{
      if(resp){
        const orden = resp.data;
        const modal = await this.modalController.create({
          component: DatosSolicitudPage,
          backdropDismiss: false,
          componentProps: { orden }
        });
        await modal.present();

        const value: any = await modal.onDidDismiss();
        if (value.data === true){
          this.cardSkeleton = true;
          this.noData = false;
          const datosUsuario = await this.storage.get('datos');
          if (datosUsuario){
            this.getOrdenesTrabajo( datosUsuario, 'V' );
          }
        }
      }else{
        this.alertService.presentAlert(resp.message);
      }
    });
  }

  async mostrarModalMovil( codigo, solicitud ){
    await this.presentLoading();
    //const ordenEsecifica = await this.storage.get(codigo);
    (await this.disatelService.getOrdenTrabajo(codigo, solicitud)).subscribe(async (resp: any) =>{
      if(resp){
        const orden = resp.data;
        const modal = await this.modalController.create({
          component: DatosMovilesPage,
          backdropDismiss: false,
          componentProps: { orden }
        });
        await modal.present();

        const value: any = await modal.onDidDismiss();
        if (value.data === true){
          this.cardSkeleton = true;
          this.noData = false;
          const datosUsuario = await this.storage.get('datos');
          if (datosUsuario){
            this.getOrdenesTrabajo( datosUsuario, 'V' );
          }
        }
      }else{
        this.alertService.presentAlert(resp.message);
      }
    });
  }

  async mostrarModalEmergente( ot, vehiculo ){
    await this.presentLoading();
    let equiposDisponibles;
    let simsDisponibles;
    (await this.disatelService.getEquiposDisponibles()).subscribe(async (resp: any) => {
        equiposDisponibles = resp.data;
        (await this.disatelService.getSimsDisponibles()).subscribe(async (resp: any) => {
          simsDisponibles = resp.data;
          (await this.disatelService.otEmergente(ot, vehiculo)).subscribe(async (resp: any) => {
            console.log(resp);
            if (resp.status) {
              const orden = resp.data;
              console.log(orden);
              const modal = await this.modalController.create({
                component: DatosEmergentesPage,
                backdropDismiss: false,
                componentProps: { orden, equiposDisponibles, simsDisponibles }
              });
              await modal.present();

              const value: any = await modal.onDidDismiss();
              if(value.data === true){
                this.cardSkeleton = true;
                this.segmento = 'emergentes';
                this.getDataEmergentes();
              }
            } else {
              this.loadingController.dismiss();
              this.alertService.presentAlert(resp.message);
            }
          });
        });
    });
  }

  async mostrarMenuOTEmergente(){
    await this.presentLoading();
        const modal = await this.modalController.create({
          component: OTEmergentePage,
          backdropDismiss: false
        });
        await modal.present();

        const value: any = await modal.onDidDismiss();
        if (value.data === true){
          this.cardSkeleton = true;
          this.segmento = 'emergentes';
          this.getDataEmergentes();
        }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }


  async descargar(orden){

    await this.presentLoading();

    (await this.disatelService.getOrdenTrabajo(orden.vehiculo, orden.solicitud)).subscribe(async (resp: any) => {
      orden.detalles = await resp.data[0];
    });
    (await this.disatelService.geServicios(orden.vehiculo, orden.solicitud)).subscribe(async (respo: any) => {
      orden.servicios = await respo.data;
    });
    (await this.disatelService.geTecnicos(orden.codigo)).subscribe(async (respon: any) => {
      orden.tecnicos = await respon.data;
    });
    (await this.disatelService.getInterirores()).subscribe(async (resp: any) => {
      orden.preguntas.general.preguntas = await resp.data[2];
      orden.preguntas.interiores.preguntas = await resp.data[1];
      orden.preguntas.luces.preguntas = await resp.data[0];
    });
    (await this.disatelService.getTitulosImagenes()).subscribe(async (resp: any) => {
      orden.titulosImagenes = await resp.data;
    });

    setTimeout(async () => {
      await this.storage.set(orden.vehiculo, orden);
      await this.loadingController.dismiss();
    }, 1000);

  }

  sicronizar(){
    this.rutas.forEach(element => {
      this.http.get(element).subscribe(resp =>{
        console.log(resp);
      });
    });
  }

  segment(ev){
    if(ev.detail.value === 'dispositivos'){
      this.ordenes = false;
      this.emergentes = false;
      this.ordenesDeTrabajo = [];
      this.getData('M');
      this.dispositivos = true;

    }else if(ev.detail.value === 'emergentes'){
      this.ordenes = false;
      this.emergentes = true;
      this.ordenesDeTrabajo = [];
      this.getDataEmergentes();
      this.dispositivos = false;
    }else{
      this.ordenes = true;
      this.emergentes = false;
      this.dispositivos = false;
      this.ordenesDeTrabajo = [];
      this.getData('V');
    }
  }

  navigate(ev){
    if(ev === 'barcode'){
      this.navCtrl.navigateForward('/recepciones');
    }else{
      this.navCtrl.navigateForward('/entrega');
    }
  }

  async doRefresh(event){
    this.getData('V').then(() => {
      event.target.complete();
    });

  }

}
