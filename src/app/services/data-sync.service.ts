import { Injectable } from '@angular/core';
import { DisatelService } from './disatel.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataSyncService {

  rutas = [];

  constructor( private storage: Storage, private disatelService: DisatelService, private http: HttpClient ) {
    this.cargarStorage();
  }

  async cargarStorage() {
    this.rutas = await this.storage.get('rutas') || [];
  }


  async saveApi( ruta ) {
    await this.cargarStorage();
    this.rutas.push( ruta );
    this.storage.set('rutas', this.rutas);
  }

  async executeApi<T>( endpoint ){
    console.log(endpoint);
    return this.http.get<T>(endpoint);
  }

}
