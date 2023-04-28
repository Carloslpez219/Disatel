import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DisatelService } from 'src/app/services/disatel.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.page.html',
  styleUrls: ['./entrega.page.scss'],
})
export class EntregaPage implements OnInit {

  equipos;
  sims;

  constructor(private navCtrl: NavController, private disatelService: DisatelService) { }

  async ngOnInit() {
    (await this.disatelService.getSimsDisponibles()).subscribe((resp: any)=>{
      this.sims = resp.data
      console.log(this.sims)
    });
    (await this.disatelService.getEquiposDisponibles()).subscribe((resp: any)=>{
      this.equipos = resp.data
    });
  }

  back(){
    this.navCtrl.back({animated: true});
  }

  check(ev){
    console.log(ev.detail.value)
  }

}
