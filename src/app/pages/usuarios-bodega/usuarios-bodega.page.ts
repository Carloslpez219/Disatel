import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { DisatelService } from 'src/app/services/disatel.service';

@Component({
  selector: 'app-usuarios-bodega',
  templateUrl: './usuarios-bodega.page.html',
  styleUrls: ['./usuarios-bodega.page.scss'],
})
export class UsuariosBodegaPage implements OnInit {

  @Input() entregas;
  viewEntered = false;
  usuario = '';
  usuarios;
  fechaHora;

  constructor(private modalController: ModalController, private disatelService: DisatelService, private alertController: AlertController,
    private alertService: AlertService) { }

  async ngOnInit() {
    (await this.disatelService.getUsuarios()).subscribe((resp: any)=>{
      this.usuarios = resp.data
      console.log(resp.data)
    });
  }

  async ionViewDidEnter() {
    this.viewEntered = true;
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.modalController.dismiss();
  }

  getDate(){
    let todayDate;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    todayDate = dd + '/' + mm + '/' + yyyy;
    return todayDate;
  }

  getHour(){
    const hoy = new Date();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    return hora;
  }

  async select(){
    console.log(this.entregas)
    if(this.entregas !== undefined){
      const resultado = this.entregas.join(',');
      this.fechaHora = await this.getDate() + ' ' + this.getHour();
      (await this.disatelService.entregaBodega(this.usuario, resultado, this.fechaHora)).subscribe((resp: any)=>{
        if(resp.status){
          this.alertService.presentToast(resp.message, 'success', 3000);
          this.modalController.dismiss(true);
        }else{
          this.alertService.presentToast(resp.message, 'danger', 3000);
        }
      })
    }
  }

  async presentAlertConfirm(ev) {
    this.usuario = ev.detail.value;
    const alert = await this.alertController.create({
      header: '¿Entregar estos Equipos y/o SIMs a Bodega?',
      message: '¿Desea entregar estos equipos y/o SIMs a Bodega?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.usuario = '';
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.select();
          },
        },
      ],
    });

    await alert.present();
  }

  

}
