import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { ModalObservacionesPage } from '../modal-observaciones/modal-observaciones.page';
import { DataSyncService } from '../../services/data-sync.service';
import { Storage } from '@ionic/storage';
import { SelccionEquipoPage } from '../selccion-equipo/selccion-equipo.page';

@Component({
  selector: 'app-travajar-vehiculo-op',
  templateUrl: './travajar-vehiculo-op.page.html',
  styleUrls: ['./travajar-vehiculo-op.page.scss'],
})
export class TravajarVehiculoOpPage implements OnInit {

  @Input() vehiculo;
  @Input() orden;
  viewEntered;
  atras: boolean;
  equiposAsignados = [];
  simAsignadas = [];
  // Estados de la orden
  sinIniciar = false;
  canceladaFallidaCompletada = false;
  completada = false;
  observaciones = '';
  fechaHora;
  datosUsuario;

  constructor(private loadingController: LoadingController, private platform: Platform, private modalController: ModalController,
              private dataSyncService: DataSyncService, private storage: Storage) { }

  ionViewDidEnter() {
    this.viewEntered = true;
    console.log(this.vehiculo, this.orden);
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

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async ngOnInit() {
    this.datosUsuario = await this.storage.get('datos');
    this.loadingController.dismiss();
  }

  async back(){
    this.atras = true;
    this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss(this.atras);
    });
    this.modalController.dismiss(this.atras);
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

  //Estados

  async iniciarTrabajo(){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value){
      this.observaciones = value.data;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=inicarVehiculo
                                    &ot=${this.orden.codigo}&vehiculo=${this.vehiculo.codigo}&usuario=${this.datosUsuario.codigo}
                                    &observaciones=${this.observaciones}&fecha_hora=${this.fechaHora}`);

                                    this.completada = false;
                                    this.sinIniciar = false;
                                    this.canceladaFallidaCompletada = true;

      this.orden.detalles.vehiculos.forEach(async element => {
        if(element.codigo === this.vehiculo.codigo){
          element.situacion_trabajo = await 2;
        }
      });

      this.storage.set(this.orden.codigo, this.orden );
    }


  }

  async cancelarTrabajo(){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value){
      this.observaciones = value.data;
    }

    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=cancelarVehiculo
                                  &ot=${this.orden.codigo}&vehiculo=${this.vehiculo.codigo}&usuario=${this.datosUsuario.codigo}
                                  &observaciones=${this.observaciones}&fecha_hora=${this.fechaHora}`);

                                  this.completada = true;
                                  this.sinIniciar = false;
                                  this.canceladaFallidaCompletada = false;

    this.orden.detalles.vehiculos.forEach(async element => {
      if(element.codigo === this.vehiculo.codigo){
        element.situacion_trabajo = await 3;
      }
    });

    this.storage.set(this.orden.codigo, this.orden );

  }

  async trabajoFallido(){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value){
      this.observaciones = value.data;
    }

    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=fallidoVehiculo
                                  &ot=${this.orden.codigo}&vehiculo=${this.vehiculo.codigo}&usuario=${this.datosUsuario.codigo}
                                  &observaciones=${this.observaciones}&fecha_hora=${this.fechaHora}`);

                                  this.completada = true;
                                  this.sinIniciar = false;
                                  this.canceladaFallidaCompletada = false;

    this.orden.detalles.vehiculos.forEach(async element => {
      if(element.codigo === this.vehiculo.codigo){
        element.situacion_trabajo = await 3;
      }
    });

    this.storage.set(this.orden.codigo, this.orden );

  }

  async finalizarTrabajo(){
    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value){
      this.observaciones = value.data;
    }

    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=finalizarVehiculo
                                  &ot=${this.orden.codigo}&vehiculo=${this.vehiculo.codigo}&usuario=${this.datosUsuario.codigo}
                                  &observaciones=${this.observaciones}&fecha_hora=${this.fechaHora}`);

                                  this.completada = true;
                                  this.sinIniciar = false;
                                  this.canceladaFallidaCompletada = false;

    this.orden.detalles.vehiculos.forEach(async element => {
      if(element.codigo === this.vehiculo.codigo){
        element.situacion_trabajo = await 3;
      }
    });

    this.storage.set(this.orden.codigo, this.orden );

  }

  async seleccionar(eq){

    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      const equipos = this.orden.detalles.equipos.filter((item) => item.codigo !== eq.codigo);
      this.orden.detalles.equipos = equipos;
      await this.equiposAsignados.push(eq);
      this.orden.equiposAsignados = await this.equiposAsignados;
      this.observaciones = value.data;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=selecciona_equipo
                                    &ot=${this.orden.codigo}&equipo=${eq.codigo}&vehiculo=${this.vehiculo.codigo}
                                    &usuario=${this.datosUsuario.codigo}
                                    &ubicacion=${this.observaciones}&fecha_hora=${this.fechaHora}`);

      await this.storage.set(this.orden.codigo, this.orden );
    }
  }

  async desSeleccionarEquipo(eq){

    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      const equipos = this.orden.equiposAsignados.filter((item) => item.codigo !== eq.codigo);
      this.orden.equiposAsignados = equipos;
      await this.orden.detalles.equipos.push(eq);
      this.observaciones = value.data;
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=desinstalacion
                                    &ot=${this.orden.codigo}&equipo=${eq.codigo}&vehiculo=${this.vehiculo.codigo}
                                    &usuario=${this.datosUsuario.codigo}&fecha_hora=${this.fechaHora}`);

      await this.storage.set(this.orden.codigo, this.orden );
    }
  }

  async seleccionarSim(sim){

    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      this.observaciones = value.data;
      const orden = this.orden;
      const modal2 = await this.modalController.create({
        component: SelccionEquipoPage,
        backdropDismiss: false,
        componentProps: {orden}
      });
      await modal2.present();
      const value2: any = await modal2.onDidDismiss();
      if(value2.data !== undefined){
        const sims = this.orden.detalles.sims.filter((item) => item.codigo !== sim.codigo);
        this.orden.detalles.sims = sims;
        await this.simAsignadas.push(sim);
        this.orden.simsAsignados = await this.simAsignadas;
        this.fechaHora = await this.getDate() + ' ' + this.getHour();
        this.dataSyncService.saveApi(`https://${this.datosUsuario.dominio}//ROOT/API/API_ot_ejecutar.php?request=selecciona_sim
                                      &ot=${this.orden.codigo}&sim=${sim.codigo}&equipo=${value2.data}&vehiculo=${this.vehiculo.codigo}
                                      &usuario=${this.datosUsuario.codigo}&fecha_hora=${this.fechaHora}`);

        await this.storage.set(this.orden.codigo, this.orden );
      }
    }
  }

  async desSeleccionarSim(sim){

    await this.presentLoading();
    const modal = await this.modalController.create({
      component: ModalObservacionesPage,
      backdropDismiss: false
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value.data !== undefined){
      const sims = this.orden.simsAsignados.filter((item) => item.codigo !== sim.codigo);
      this.orden.simsAsignados = sims;
      await this.orden.detalles.sims.push(sim);
      this.observaciones = value.data;
      await this.storage.set(this.orden.codigo, this.orden );
    }
  }

}
