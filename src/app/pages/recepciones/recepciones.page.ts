import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recepciones',
  templateUrl: './recepciones.page.html',
  styleUrls: ['./recepciones.page.scss'],
})
export class RecepcionesPage implements OnInit {

  myAngularxQrCode = '';
  showQR = false;

  constructor(private navCtrl: NavController, private barcodeScanner: BarcodeScanner) {
   }

  ngOnInit() {
  }

  back(){
    this.navCtrl.back({animated: true});
  }

  scanBarcode(){
    this.barcodeScanner.scan().then(async barcodeData => {
      console.log('Barcode data', barcodeData);
     }).catch(err => {
       console.log('Error', err);
     });
  }

  show(){
    this.showQR = true;
  }

}
