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
  respuestas = [];
  def = [];
  respuestax;
  viewEntered;
  respuestasRegistradas = [];


  constructor( private platform: Platform, private modalController: ModalController ) { }

  ionViewDidEnter() {
    setTimeout(() => {
      this.viewEntered = true;
    }, 500);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }


  ngOnInit() {
    if(this.orden.preguntas.general.respuestas !== null && this.orden.preguntas.general.respuestas.length !== 0){
      this.respuestasRegistradas = this.orden.preguntas.general.respuestas;
    }
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

  respuesta(event, i){
    this.respuestas[i] = event.detail.value;
  }

  siguiente(){
    this.modalController.dismiss(this.respuestas);
  }

}
