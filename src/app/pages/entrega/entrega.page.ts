import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DisatelService } from 'src/app/services/disatel.service';
import { UsuariosBodegaPage } from '../usuarios-bodega/usuarios-bodega.page';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.page.html',
  styleUrls: ['./entrega.page.scss'],
})
export class EntregaPage implements OnInit {

  equipos = [];
  sims = [];
  entregas = [];
  traslado = false;

  constructor(private navCtrl: NavController, private disatelService: DisatelService, private modalController: ModalController) { }

  async ngOnInit() {
    (await this.disatelService.getEquiposAIstalar('')).subscribe((resp: any)=>{
      this.equipos = resp.data;
      console.log(resp.data);
    });
    (await this.disatelService.getSims('')).subscribe((resp: any)=>{
      this.sims = resp.data;
    });
  }

  back(){
    this.navCtrl.back({animated: true});
  }

  check(ev){
    if(ev.detail.checked){
      this.entregas.push(ev.detail.value); 
      this.traslado = true;
    }else{
      const index = this.entregas.indexOf(ev.detail.value);
      if (index !== -1) {
        this.entregas.splice(index, 1);
      }
    }
  }

  checkSIM(ev){
    if(ev.detail.checked){
      this.entregas.push(ev.detail.value);
      this.traslado = true;
    }else{
      const index = this.entregas.indexOf(ev.detail.value);
      if (index !== -1) {
        this.entregas.splice(index, 1);
      }
    }
  }

  async getClientes(){
    const entregas = this.entregas;
    const modal = await this.modalController.create({
      component: UsuariosBodegaPage,
      backdropDismiss: false,
      componentProps: {entregas}
    });
    await modal.present();
    const value: any = await modal.onDidDismiss();
    if(value.data === true){
      (await this.disatelService.getEquiposAIstalar('')).subscribe((resp: any)=>{
        this.equipos = resp.data;
        console.log(resp.data);
      });
      (await this.disatelService.getSims('')).subscribe((resp: any)=>{
        this.sims = resp.data;
      });
    }
  }

}
