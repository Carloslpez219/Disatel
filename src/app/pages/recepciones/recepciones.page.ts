import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DisatelService } from 'src/app/services/disatel.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-recepciones',
  templateUrl: './recepciones.page.html',
  styleUrls: ['./recepciones.page.scss'],
})
export class RecepcionesPage implements OnInit {

  fechaHora;
  datoEscaneado = '';
  tipo;

  constructor(private navCtrl: NavController, private barcodeScanner: BarcodeScanner, private disatelService: DisatelService,
    private alertController: AlertService) {
   }

  ngOnInit() {
  }

  back(){
    this.navCtrl.back({animated: true});
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

  scanBarcode(){
    this.barcodeScanner.scan().then(async barcodeData => {
      this.datoEscaneado = barcodeData.text;
     }).catch(err => {
       console.log('Error', err);
     });
  }

  async enviar(){
    this.fechaHora = await this.getDate() + ' ' + this.getHour();
    (await this.disatelService.escanearDato(this.tipo, this.datoEscaneado, this.fechaHora)).subscribe((resp:any)=>{
      if(resp.status){
        this.alertController.presentToast(resp.message, 'success', 3000);
        this.datoEscaneado = '';
      }else{
        this.alertController.presentToast(resp.message, 'danger', 3000);
      }
    });
  }

  Tipo(ev){
    this.tipo = ev.detail.value;
  }

}
