import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selccion-equipo',
  templateUrl: './selccion-equipo.page.html',
  styleUrls: ['./selccion-equipo.page.scss'],
})
export class SelccionEquipoPage implements OnInit {

  @Input() orden;
  codigoEquipo;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async back(){
    this.modalController.dismiss();
  }

  onChange(ev){
    console.log(ev);
    this.codigoEquipo = ev.detail.value;
  }

  proceed(){
    this.modalController.dismiss(this.codigoEquipo);
  }

}
