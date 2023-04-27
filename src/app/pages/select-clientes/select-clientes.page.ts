import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DisatelService } from 'src/app/services/disatel.service';

@Component({
  selector: 'app-select-clientes',
  templateUrl: './select-clientes.page.html',
  styleUrls: ['./select-clientes.page.scss'],
})
export class SelectClientesPage implements OnInit {

  clientes;
  viewEntered = false;
  cliente='';

  constructor(private loadingController: LoadingController, private modalController: ModalController,
    private disatelService:DisatelService) { }

  async ngOnInit() {
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...'
    });
    await loading.present();
  }

  ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.modalController.dismiss();
  }

  check(ev){
    console.log(ev.detail.value)
    this.modalController.dismiss(ev.detail.value);
  }

  async getClientes() {
    (await this.disatelService.getClientes(this.cliente)).subscribe((resp: any)=>{
      if(resp.status){
        this.clientes = resp.data;
        this.loadingController.dismiss();
      }
    });
  }

}
