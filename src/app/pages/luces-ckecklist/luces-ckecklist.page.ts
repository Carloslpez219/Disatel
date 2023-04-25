import { DisatelService } from 'src/app/services/disatel.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { InteriorCkecklistPage } from '../interior-ckecklist/interior-ckecklist.page';

@Component({
  selector: 'app-luces-ckecklist',
  templateUrl: './luces-ckecklist.page.html',
  styleUrls: ['./luces-ckecklist.page.scss'],
})
export class LucesCkecklistPage implements OnInit {

  @Input() luces;
  @Input() orden;
  @Input() preguntas;
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
      this.modalController.dismiss(true);
    });
    this.modalController.dismiss(true);
  }


  async respuesta(event, i){
    (await this.disatelService.respondeChecklist(this.orden.solicitud, this.orden.vehiculo, event.detail.value, i)).
    subscribe(resp =>{
      console.log(resp);
    });
  }

  siguiente(){
    this.modalController.dismiss(false);
    this.mostrarModalInterior();
  }

  async mostrarModalInterior() {
    const interiores = this.preguntas[1];
    const preguntas = this.preguntas;
    const orden = this.orden;

    const modal = await this.modalController.create({
      component: InteriorCkecklistPage,
      backdropDismiss: false,
      componentProps: { interiores, orden, preguntas }
    });
    await modal.present();
  }

}
