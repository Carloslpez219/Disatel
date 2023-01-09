import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ver-datos',
  templateUrl: './ver-datos.page.html',
  styleUrls: ['./ver-datos.page.scss'],
})
export class VerDatosPage implements OnInit {

  @Input() equipo;
  viewEntered;

  constructor( private modalController: ModalController, private loadingController: LoadingController, private platform: Platform) { }


  ionViewDidEnter() {
    this.viewEntered = true;
    this.loadingController.dismiss();
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  ngOnInit() {
  }

  back(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
    this.modalController.dismiss();
  }

}
