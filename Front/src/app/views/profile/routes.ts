import { Routes } from '@angular/router';
import { permissionGard } from '../../guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Profile',
    },
    children: [
      {
        path: 'permisos',
        loadComponent: () =>
          import('./permisos/permisos.component').then(
            (m) => m.PermisosComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'permisos', operacion: 'r' },
      },
      {
        path: 'propiedades',
        
        loadComponent: () =>
          import('./propiedades/propiedades.component').then(
            (m) => m.PropiedadesComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'propiedades', operacion: 'r' },
      },
      {
        path: 'roles',
        
        loadComponent: () =>
          import('./roles/roles.component').then(
            (m) => m.RolesComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'roles', operacion: 'r' },
      },
      {
        path: 'usuarios',
        
        loadComponent: () =>
          import('./usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'usuarios', operacion: 'r' },
      },
      {
        path: 'imagen-propiedad',
        
        loadComponent: () =>
          import('./imagen-propiedad/imagen-propiedad.component').then(
            (m) => m.ImagenPropiedadComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'imagenes_propiedad', operacion: 'r' },
      },
      {
        path: 'rol-permiso',
        
        loadComponent: () =>
          import('./rol-permiso/rol-permiso.component').then(
            (m) => m.RolPermisoComponent
          ),
        canActivate: [permissionGard],
        data: { modulo: 'rol_permiso', operacion: 'r' },
      },
      {
        path: 'tipos-propiedad',
        
        loadComponent: () =>
          import('./tipos-propiedad/tipos-propiedad.component').then((m) => m.TipoPropiedadComponent)
        ,
        canActivate: [permissionGard],
        data: { modulo: 'tipos_propiedad', operacion: 'r' },
      },
      {
        path: 'modulos',
        loadComponent: () =>
          import('./modulos/modulos.component').then((m) => m.ModulosComponent),
        canActivate: [permissionGard],
        data: { modulo: 'modulos', operacion: 'r' } 
      },
      {
        path: 'operaciones',
        loadComponent: () =>
          import('./operaciones/operaciones.component').then((m) => m.OperacionesComponent),
        canActivate: [permissionGard],
        data: { modulo: 'operacion', operacion: 'r' }
      }
    ],
  },
];
