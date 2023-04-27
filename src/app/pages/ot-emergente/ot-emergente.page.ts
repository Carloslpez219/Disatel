import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DisatelService } from 'src/app/services/disatel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SerchebleSelectPage } from '../sercheble-select/sercheble-select.page';
import { SelectClientesPage } from '../select-clientes/select-clientes.page';

@Component({
  selector: 'app-ot-emergente',
  templateUrl: './ot-emergente.page.html',
  styleUrls: ['./ot-emergente.page.scss'],
})
export class OTEmergentePage implements OnInit {

  viewEntered = false;
  recharge;
  clientes;
  trabajos;
  sedes;
  emergente: FormGroup;
  sede;
  trabajo;
  cliente;
  fechaHora
  clienteFound='';
  trabajoFound='';
  codigoFound='';

  constructor(private modalController: ModalController, public loadingController: LoadingController,private disatelService: DisatelService,
    private alertService: AlertService) { 
      this.emergente = this.createFormGroup();
      this.fechaHora = this.getDate() + ' ' + this.getHour();
    }

  //FORM

  createFormGroup() {
    return new FormGroup({
      placa: new FormControl('', [Validators.required]),
      justificacion: new FormControl('', [Validators.required])
    });
  }

  get placa() { return this.emergente.get('placa'); }
  get justificacion() { return this.emergente.get('justificacion'); }
 
  async ngOnInit() {
    (await this.disatelService.getSedes()).subscribe((resp: any)=>{
      if(resp.status){
        this.sedes = resp.data;
      }else{ 
        this.alertService.presentAlert(resp.message);
      }
    });
    (await this.disatelService.getTrabajos()).subscribe((resp: any)=>{
      if(resp.status){
        this.trabajos = resp.data;
      }else{ 
        this.alertService.presentAlert(resp.message);
      }
    });
    (await this.disatelService.getClientes('')).subscribe((resp: any)=>{
      if(resp.status){
        this.clientes = resp.data;
      }else{ 
        this.alertService.presentAlert(resp.message);
      }
    });
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

  selectSede(ev){
    this.sede = ev.detail.value;
  }

  convertirFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear().toString();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
  
    return `${dia}/${mes}/${anio} ${hora}:${minutos}:${segundos}`;
  }
  

  fecha(ev){
    this.fechaHora = this.convertirFecha(ev.detail.value);
    console.log(this.fechaHora);
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

  async otEmergente(){
    (await this.disatelService.nuevaOtEmergente(this.sede, this.cliente, this.fechaHora, this.emergente.value.placa, this.trabajo, this.emergente.value.justificacion, this.codigoFound))
      .subscribe((resp:any)=>{
        if(resp.status){
          this.alertService.presentToast(resp.message, 'success', 3000);
          this.modalController.dismiss(true);
        }else{
          this.alertService.presentToast(resp.message, 'danger', 3000);
        }
      })
  }

  async selectCliente(){

    const modal = await this.modalController.create({
      component: SelectClientesPage,
      backdropDismiss: false
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data){
      console.log(value);
      this.cliente = value.data;
      this.clientes.forEach(element => {
        if(element.codigo === this.cliente){
          this.clienteFound = element.nombre;
        }
      });
    }
  }

  async selectTrabajo(){

    this.presentLoading();
    const data = this.trabajos;
    const modal = await this.modalController.create({
      component: SerchebleSelectPage,
      backdropDismiss: false,
      componentProps: { data }
    });
    await modal.present();

    const value: any = await modal.onDidDismiss();
    if (value.data){
      console.log(value);
      this.trabajo = value.data;
      this.trabajos.forEach(element => {
        if(element.codigo === this.trabajo){
          this.trabajoFound = element.nombre;
        }
      });
    }
  }

  async onInputChange(event: any) {
    const inputValue = event.target.value;
    (await this.disatelService.validarPlaca(inputValue, this.cliente)).subscribe((resp:any)=>{
      if(!resp.status){
        this.alertService.presentToast(resp.message, 'danger', 3000);
      }else{
        this.codigoFound = resp.vehiculo;
      }
    });

  }

}
