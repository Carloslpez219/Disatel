import { DisatelService } from './../../services/disatel.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-general-ckecklist',
  templateUrl: './general-ckecklist.page.html',
  styleUrls: ['./general-ckecklist.page.scss'],
})
export class GeneralCkecklistPage implements OnInit {

  @Input() general;
  @Input() orden;
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
    const index = i + 26;
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
  }

}
