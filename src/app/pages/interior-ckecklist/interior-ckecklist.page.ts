import { DisatelService } from './../../services/disatel.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { GeneralCkecklistPage } from '../general-ckecklist/general-ckecklist.page';

@Component({
  selector: 'app-interior-ckecklist',
  templateUrl: './interior-ckecklist.page.html',
  styleUrls: ['./interior-ckecklist.page.scss'],
})
export class InteriorCkecklistPage implements OnInit {

  @Input() interiores;
  @Input() orden;
  @Input() preguntas;
  @Input() tipo;

  viewEntered;

  constructor( private platform: Platform, private modalController: ModalController, private disatelService: DisatelService ) { }

  ionViewDidEnter() {
    setTimeout(() => {
      this.viewEntered = true;
    }, 500);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }


  ngOnInit() {
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

  async respuesta(event, i){
    const index = i + 8;
    if(this.tipo === 'emergente'){
      (await this.disatelService.respondeChecklistEmergente(this.orden.ot, this.orden.vehiculo, event.detail.value, index)).
      subscribe(resp =>{
        console.log(resp);
      });
    }else{
      (await this.disatelService.respondeChecklist(this.orden.solicitud, this.orden.vehiculo, event.detail.value, index)).
      subscribe(resp =>{
        console.log(resp);
      });
    }
  }

  siguiente(){
    this.modalController.dismiss();
    this.mostrarModalGeneral();
  }

  async mostrarModalGeneral() {
    const general = this.preguntas[2];
    const orden = this.orden;
    const tipo = this.tipo;

    const modal = await this.modalController.create({
      component: GeneralCkecklistPage,
      backdropDismiss: false,
      componentProps: { general, orden, tipo }
    });
    await modal.present();
  }

}
