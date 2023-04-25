import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './guards/guard.guard';

const routes: Routes = [
  {
    canActivate: [GuardGuard],
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'security',
    loadChildren: () => import('./pages/security/security.module').then( m => m.SecurityPageModule)
  },
  {
    path: 'datos-solicitud',
    loadChildren: () => import('./pages/datos-solicitud/datos-solicitud.module').then( m => m.DatosSolicitudPageModule)
  },
  {
    path: 'observaciones',
    loadChildren: () => import('./pages/observaciones/observaciones.module').then( m => m.ObservacionesPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'trabajar-vehiculo',
    loadChildren: () => import('./pages/trabajar-vehiculo/trabajar-vehiculo.module').then( m => m.TrabajarVehiculoPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'ver-sim',
    loadChildren: () => import('./pages/ver-sim/ver-sim.module').then( m => m.VerSIMPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'ver-datos',
    loadChildren: () => import('./pages/ver-datos/ver-datos.module').then( m => m.VerDatosPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'modal-observaciones',
    loadChildren: () => import('./pages/modal-observaciones/modal-observaciones.module').then( m => m.ModalObservacionesPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'travajar-vehiculo-op',
    loadChildren: () => import('./pages/travajar-vehiculo-op/travajar-vehiculo-op.module').then( m => m.TravajarVehiculoOpPageModule)
  },{
    canActivate: [GuardGuard],
    path: 'checklist',
    loadChildren: () => import('./pages/checklist/checklist.module').then( m => m.ChecklistPageModule)
  },
  {
    canActivate: [GuardGuard],
    path: 'luces-ckecklist',
    loadChildren: () => import('./pages/luces-ckecklist/luces-ckecklist.module').then( m => m.LucesCkecklistPageModule)
  },
  {
    path: 'interior-ckecklist',
    loadChildren: () => import('./pages/interior-ckecklist/interior-ckecklist.module').then( m => m.InteriorCkecklistPageModule)
  },
  {
    path: 'general-ckecklist',
    loadChildren: () => import('./pages/general-ckecklist/general-ckecklist.module').then( m => m.GeneralCkecklistPageModule)
  },
  {
    path: 'selccion-equipo',
    loadChildren: () => import('./pages/selccion-equipo/selccion-equipo.module').then( m => m.SelccionEquipoPageModule)
  },
  {
    path: 'accesorios',
    loadChildren: () => import('./pages/accesorios/accesorios.module').then( m => m.AccesoriosPageModule)
  },
  {
    path: 'modal-sign',
    loadChildren: () => import('./pages/modal-sign/modal-sign.module').then( m => m.ModalSignPageModule)
  },
  {
    path: 'recepciones',
    loadChildren: () => import('./pages/recepciones/recepciones.module').then( m => m.RecepcionesPageModule)
  },
  {
    path: 'entrega',
    loadChildren: () => import('./pages/entrega/entrega.module').then( m => m.EntregaPageModule)
  },
  {
    path: 'detail-modal-moviles',
    loadChildren: () => import('./pages/detail-modal-moviles/detail-modal-moviles.module').then( m => m.DetailModalMovilesPageModule)
  },
  {
    path: 'instalarsim',
    loadChildren: () => import('./pages/instalarsim/instalarsim.module').then( m => m.InstalarsimPageModule)
  },
  {
    path: 'datos-moviles',
    loadChildren: () => import('./pages/datos-moviles/datos-moviles.module').then( m => m.DatosMovilesPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'trabajar-dmovil',
    loadChildren: () => import('./pages/trabajar-dmovil/trabajar-dmovil.module').then( m => m.TrabajarDmovilPageModule)
  },
  {
    path: 'ot-emergente',
    loadChildren: () => import('./pages/ot-emergente/ot-emergente.module').then( m => m.OTEmergentePageModule)
  },
  {
    path: 'datos-emergentes',
    loadChildren: () => import('./pages/datos-emergentes/datos-emergentes.module').then( m => m.DatosEmergentesPageModule)
  },
  {
    path: 'trabajar-emergentes',
    loadChildren: () => import('./pages/trabajar-emergentes/trabajar-emergentes.module').then( m => m.TrabajarEmergentesPageModule)
  },
  {
    path: 'serchable-select',
    loadChildren: () => import('./pages/sercheble-select/sercheble-select.module').then( m => m.SerchebleSelectPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
