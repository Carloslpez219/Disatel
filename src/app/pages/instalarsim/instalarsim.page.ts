import { ModalController, Platform } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-instalarsim',
  templateUrl: './instalarsim.page.html',
  styleUrls: ['./instalarsim.page.scss'],
})
export class InstalarsimPage implements OnInit {

  @Input() equipos;
  viewEntered;
  equipo;

  constructor(private modalController: ModalController, private platform: Platform) { }

  ngOnInit() {
    console.log(this.equipos);
  }

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

  aceptar(){
    this.modalController.dismiss(this.equipo);
  }

  select(ev){
    this.equipo = ev.detail.value;
    console.log(this.equipo);
  }

}
