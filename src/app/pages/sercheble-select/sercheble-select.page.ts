import { LoadingController, ModalController, SearchbarCustomEvent } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sercheble-select',
  templateUrl: './sercheble-select.page.html',
  styleUrls: ['./sercheble-select.page.scss'],
})
export class SerchebleSelectPage implements OnInit {

  @Input() data;
  viewEntered = false;
  itemTextField = '';
  filtered = [];

  constructor(private loadingController: LoadingController, private modalController: ModalController) { }

  ngOnInit() {
    this.filtered = this.data;
  }

  async ionViewDidEnter() {
    setTimeout(async () => {
      this.viewEntered = await true;
      await this.loadingController.dismiss();
    }, 800);
  }

  ionViewWillLeave(){
    this.viewEntered = false;
  }

  async back(){
    this.modalController.dismiss();
  }

  onSearchChange(event){
    const filter = event.detail.value.toLocaleLowerCase();
    this.filtered = this.data.filter(item => item.nombre.toLowerCase().indexOf(filter) >= 0
      );
  }

  check(ev){
    this.modalController.dismiss(ev.detail.value);
  }

}
