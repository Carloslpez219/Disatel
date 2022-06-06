import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Data, RootObject } from 'src/app/interfaces/Data';
import { DisatelService } from 'src/app/services/disatel.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { DatosSolicitudPage } from '../datos-solicitud/datos-solicitud.page';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Skeleton view
  cardSkeleton: boolean;
  skeletonScreen = Array(3);
  // User data
  urlFoto;
  //Datos de trabajo
  ordenesDeTrabajo;
  //Validadción data
  noData;
  rutas;

  constructor(private storage: Storage, private disatelService: DisatelService, private userService: UserService, private router: Router,
              private alertService: AlertService, private modalController: ModalController, private loadingController: LoadingController,
              private http: HttpClient) {
    this.cardSkeleton = true;
  }

  async ionViewWillEnter() {
    this.getData();
    this.rutas = await this.storage.get('rutas') || [];
  }

  async getOrdenesTrabajo < T >(datosUsuario) {
    if (datosUsuario) {
      const isOnLine = navigator.onLine;
      if (isOnLine){
        try {
          (await this.disatelService.getOrdenesTrabajo(datosUsuario.codigo)).subscribe(async (resp: RootObject) => {
            if(resp){
              this.ordenesDeTrabajo = await resp.data;
              console.log(this.ordenesDeTrabajo);
              if (this.ordenesDeTrabajo.length === 0){
                this.noData = true;
              }else{
                this.noData = false;
              }
              this.ordenesDeTrabajo.forEach(async element => {
                (await this.disatelService.getOrdenTrabajo(element.codigo)).subscribe(async (res: any) => {
                  console.log(res.data[0]);
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
              await this.storage.set('ordenes', this.ordenesDeTrabajo);
              this.cardSkeleton = false;
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
    }else{
      this.alertService.presentAlert('Algo ha salido mal, inicie sesión de nuevo');
      this.logOut();
    }
  }

  async getData() {
    this.cardSkeleton = true;
    const datosUsuario = await this.storage.get('datos');
    if (datosUsuario) {
      this.getOrdenesTrabajo(datosUsuario);
    }
  }

  async logOut(){
    this.router.navigateByUrl('/login');
    this.storage.remove('datos');
    this.storage.remove('ordenes');
    this.storage.clear();
  }

  async mostrarModal( codigo ){

    const ordenEsecifica = await this.storage.get(codigo);

    if(ordenEsecifica){
      if(ordenEsecifica.detalles.length === 0 && ordenEsecifica.servicios.length === 0 && ordenEsecifica.tecnicos.length === 0){
        this.alertService.presentAlert('Para trabajar una orden de trabajo debes de descargar los datos primero.');
      }else{
        const modal = await this.modalController.create({
          component: DatosSolicitudPage,
          backdropDismiss: false,
          componentProps: { ordenEsecifica }
        });
        await modal.present();

        const value: any = await modal.onDidDismiss();
        if (value.data === true){
          this.cardSkeleton = true;
          this.noData = false;
          const datosUsuario = await this.storage.get('datos');
          if (datosUsuario){
            this.getOrdenesTrabajo( datosUsuario );
          }
        }
      }
    }else{
      this.alertService.presentAlert('Para trabajar una orden de trabajo debes de descargar los datos primero.');
    }

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Descargando...'
    });
    await loading.present();
  }


  async descargar(orden){

    await this.presentLoading();

    (await this.disatelService.getOrdenTrabajo(orden.codigo)).subscribe(async (resp: any) => {
      orden.detalles = await resp.data[0];
    });
    (await this.disatelService.geServicios(orden.codigo)).subscribe(async (respo: any) => {
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
      await this.storage.set(orden.codigo, orden);
      await this.loadingController.dismiss();
    }, 2000);

  }

  sicronizar(){
    this.rutas.forEach(element => {
      this.http.get(element).subscribe(resp =>{
        console.log(resp);
      });
    });
  }

}
