/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Data } from '../interfaces/Data';

const disatelUrl = environment.disatelUrl;
const disatelEjecutar = environment.disatelEjecutar;
const fotoVehiculo = environment.fotoVehiculo;
const fotoOrden = environment.fotoOrden;
const notification = environment.notification;
const coordenadas = environment.coordenadas;

@Injectable({
  providedIn: 'root'
})
export class DisatelService {

  data: object = null;
  datosUsuario;

  constructor(private http: HttpClient, private storage: Storage) {}

  async executeApi<T>( endpoint ){
    console.log(endpoint);
    return this.http.get<T>(endpoint);
  }

  async getOrdenesTrabajo<T>( usuario, tipo ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(this.datosUsuario);
    console.log(`pruebas.disatel.app${disatelUrl}ordenes_asignadas&usuario=${usuario}&tipo=${tipo}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}ordenes_asignadas&usuario=${usuario}&tipo=${tipo}`);
  }

  // nuevas rutas

  async getOrdenTrabajo<T>( ot, solicitud ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelUrl}orden&vehiculo=${ot}&solicitud=${solicitud}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}orden&vehiculo=${ot}&solicitud=${solicitud}`);
  }

  async getVehiculo<T>( vehiculo, solicitud ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelUrl}vehiculos&vehiculo=${vehiculo}&ot=${solicitud}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}vehiculos&vehiculo=${vehiculo}&ot=${solicitud}`);
  }

  async geServicios<T>( vehiculo, solicitud ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}servicios&vehiculo=${vehiculo}&solicitud=${solicitud}`);
  }

  async geTecnicos<T>( ot ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}tecnicos&ot=${ot}`);
  }

  async getAccesorios<T>( ot, vehiculo ){
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}accesorios&ot=${ot}&vehiculo=${vehiculo}`);
  }

  async getCheclist<T>(){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}checklist`);
  }

  async respondeChecklist<T>(solicitud,vehiculo,valor,pregunta){
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}responde_checklist&solicitud=${solicitud}&vehiculo=${vehiculo}&pregunta=${pregunta}&valor=${valor}`);
  }

  async iniciaChecklist<T>(solicitud,vehiculo,entrega,fechaHora){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}inicia_checklist&solicitud=${solicitud}&vehiculo=${vehiculo}&entrega=${entrega}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
  }

  //

  async ejecutarOT<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}salir&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async presente<T>( solicitud, vehiculo, observaciones, fechaHora, longitud, latitud ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}presente&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}&longitud=${longitud}&latitud=${latitud}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}presente&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}&longitud=${longitud}&latitud=${latitud}`);
  }

  async finalizarOrden<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}finalizar&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async ordenFallida<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}fallida&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}fallida&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async ordenCancelada<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}cancelar&ot=${ot}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async iniciarVehículo<T>( solicitud, vehiculo, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}iniciarVehiculo&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async finalizarVehículo<T>( solicitud, vehiculo, observaciones, fechaHora, recibe){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}finalizarVehiculo&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}&recibe=${recibe}`);
  }

  async solicitarPruebas<T>( ot, vehiculo, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}solicitarPruebas&ot=${ot}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&fecha_hora=${fechaHora}`);
  }

  async solicitarAseguramiento<T>( ot, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}solicitar_aseguramiento&ot=${ot}&usuario=${this.datosUsuario.codigo}&fecha_hora=${fechaHora}&observaciones=${observaciones}`);
  }

  async fallidoVehículo<T>( solicitud, vehiculo, observaciones,  fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}fallidoVehiculo&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}fallidoVehiculo&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async cancelarVehículo<T>( solicitud, vehiculo, observaciones, fechaHora ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}cancelarVehiculo&solicitud=${solicitud}&vehiculo=${vehiculo}&usuario=${this.datosUsuario.codigo}&observaciones=${observaciones}&fecha_hora=${fechaHora}`);
  }

  async seleccionarSim<T>( ot, vehiculo, sim, fechaHora, equipo ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}selecciona_sim&solicitud=${ot}&sim=${sim}&equipo=${equipo}&vehiculo=${vehiculo}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
  }

  async seleccionarEquipo<T>( ot, vehiculo, equipo, fechaHora, ubicacion ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}selecciona_equipo&solicitud=${ot}&vehiculo=${vehiculo}&equipo=${equipo}&ubicacion=${ubicacion}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}selecciona_equipo&solicitud=${ot}&vehiculo=${vehiculo}&equipo=${equipo}&ubicacion=${ubicacion}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}`);
  }

  async deseleccionarEquipo<T>( ot, vehiculo, equipo, fechaHora, despacho ){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}desinstalacion_equipo&solicitud=${ot}&vehiculo=${vehiculo}&equipo=${equipo}&fecha_hora=${fechaHora}&despacho=${despacho}&usuario=${this.datosUsuario.codigo}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}desinstalacion_equipo&solicitud=${ot}&vehiculo=${vehiculo}&equipo=${equipo}&fecha_hora=${fechaHora}&despacho=${despacho}&usuario=${this.datosUsuario.codigo}`);
  }

  async desinstalarSim<T>( ot, vehiculo, sim, fechaHora, despacho ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}desinstalacion_sim&solicitud=${ot}&sim=${sim}&vehiculo=${vehiculo}&fecha_hora=${fechaHora}&usuario=${this.datosUsuario.codigo}&despacho=${despacho}`);
  }

  async postFotoVehiculo<T>( ot, vehiculo, file, titulo ){
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.datosUsuario = await this.storage.get('datos');
    return this.http.post(`https://pruebas.disatel.app/${fotoVehiculo}&ot=${ot}&vehiculo=${vehiculo}&titulo=${titulo}&usuario=${this.datosUsuario.codigo}`, fd);
  }

  async postFotoChecklist<T>( ot, vehiculo, file, codigo ){
    const fd = new FormData();
    fd.append('image', file);
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${fotoVehiculo}&ot=${ot}&vehiculo=${vehiculo}&titulo=${codigo}&usuario=${this.datosUsuario.codigo}`);
    return this.http.post(`https://pruebas.disatel.app/${fotoVehiculo}&ot=${ot}&vehiculo=${vehiculo}&titulo=${codigo}&usuario=${this.datosUsuario.codigo}`, fd);
  }

  async postFoto<T>( ot, vehiculo, file, titulo ){
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${fotoOrden}solicitud=${ot}&vehiculo=${vehiculo}&titulo=${titulo}&usuario=${this.datosUsuario.codigo}`, fd);
    return this.http.post(`https://pruebas.disatel.app/${fotoOrden}solicitud=${ot}&vehiculo=${vehiculo}&titulo=${titulo}&usuario=${this.datosUsuario.codigo}`, fd);
  }

  async postFirma<T>( ot, vehiculo, file){
    const fd = new FormData();
    fd.append('image', file, file.name);
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app//ROOT/API/API_firma_vehiculo.php?solicitud=${ot}&vehiculo=${vehiculo}&titulo=5&usuario=${this.datosUsuario.codigo}`, fd);
    return this.http.post(`https://pruebas.disatel.app/ROOT/API/API_firma_vehiculo.php?solicitud=${ot}&vehiculo=${vehiculo}&titulo=5&usuario=${this.datosUsuario.codigo}`, fd);
  }

  async eliminarFotoOt<T>( ot, vehiculo, codigos ){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}deleteimagen&ot=${ot}&vehiculo=${vehiculo}&codigos=${codigos}`);
  }

  async eliminarFotoVehiculo<T>(ot, codigos){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}deleteimagenVehiculo&ot=${ot}&codigos=${codigos}`);
  }

  async getLista<T>(){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}titulos_imagenes_vehiculos`);
  }

  async getListaVehiculos<T>(){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}titulos_imagenes_vehiculos`);
  }

  async getInterirores<T>(){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}checklist`);
  }

  async getTitulosImagenes<T>(){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}titulos_imagenes_checklist`);
  }

  async getEquiposAIstalar<T>(ot){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}equiposAInstalar&ot=${ot}`);
  }

  async getEquipo<T>(ot, equipo){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}equipos&ot=${ot}&equipo=${equipo}`);
  }

  async getSims<T>(ot){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelUrl}sims&ot=${ot}`);
  }

  async setChecklist<T>( ot, vehiculo, entrega, fechahora){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}finaliza_checklist&ot=${ot}&vehiculo=${vehiculo}&entrega=${entrega}&usuario=${this.datosUsuario.codigo}&fecha_hora=${fechahora}`);
  }

  async cuestionarioVisita<T>(respuestas, ot){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}finaliza_cuestinario_visita&resultado=${respuestas}&ot=${ot}`);
  }

  async finalizaVisita<T>(ot, reportado, encontrado, solucion, observacion, recibe, internas, fechahora){
    this.datosUsuario = await this.storage.get('datos');
    console.log(`https://pruebas.disatel.app/${disatelEjecutar}finaliza_visita&ot=${ot}&recibe=${recibe}&reportado=${reportado}&encontrado=${encontrado}&solucion=${solucion}&observacion=${observacion}&internas=${internas}&usuario=${this.datosUsuario.codigo}&fecha_hora=${fechahora}`);
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}finaliza_visita&ot=${ot}&recibe=${recibe}&reportado=${reportado}&encontrado=${encontrado}&solucion=${solucion}&observacion=${observacion}&internas=${internas}&usuario=${this.datosUsuario.codigo}&fecha_hora=${fechahora}`);
  }

  async registrarVisualizacion<T>(ot){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${disatelEjecutar}registrar_visualizacion&ot=${ot}&usuario=${this.datosUsuario.codigo}`);
  }

  // NOTIFICAIONES

  async registrarDispositivo<T>( deviceId, token){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${notification}register&user_id=${this.datosUsuario.codigo}&device_id=${deviceId}&device_token=${token}&device_type=android&certificate_type=1`);
  }

  async quitarDispositivo<T>( deviceId, token){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${notification}unregister&user_id=${this.datosUsuario.codigo}&device_id=${deviceId}&device_token=${token}&device_type=android&certificate_type=1`);
  }

  async listNotifications<T>(page){
    this.datosUsuario = await this.storage.get('datos');
    return this.http.get<T>(`https://pruebas.disatel.app/${notification}list&user_id=${this.datosUsuario.codigo}type=&page=
                            ${page}`);
  }

}
