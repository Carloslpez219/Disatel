import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-luces-ckecklist',
  templateUrl: './luces-ckecklist.page.html',
  styleUrls: ['./luces-ckecklist.page.scss'],
})
export class LucesCkecklistPage implements OnInit {

  @Input() luces;
  @Input() orden;
  def = [];
  respuestas = [];
  viewEntered;
  respuestax;
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
    if(this.orden.preguntas.luces.respuestas !== null && this.orden.preguntas.luces.respuestas.length !== 0){
      this.respuestasRegistradas = this.orden.preguntas.luces.respuestas;
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
