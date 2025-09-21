import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.gard';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile',
    },
    children: [
      {
        path: '',
        redirectTo: 'permisos',
        pathMatch: 'full',
      },
      {
        path: 'permisos',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./permisos/permisos.component').then(
            (m) => m.PermisosComponent
          ),
        data: {
          title: 'Permisos',
        },
      },
      {
        path: 'propiedades',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./propiedades/propiedades.component').then(
            (m) => m.PropiedadesComponent
          ),
        data: {
          title: 'Propiedades',
        },
      },
      {
        path: 'roles',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./roles/roles.component').then((m) => m.RolesComponent),
        data: {
          title: 'Roles',
        },
      },
      {
        path: 'usuarios',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
        data: {
          title: 'Usuarios',
        },
      },
      {
        path: 'imagen-propiedad',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./imagen-propiedad/imagen-propiedad.component').then(
            (m) => m.ImagenPropiedadComponent
          ),
        data: {
          title: 'Imagen - Propiedad',
        },
      },
      {
        path: 'rol-permiso',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./rol-permiso/rol-permiso.component').then(
            (m) => m.RolPermisoComponent
          ),
        data: {
          title: 'Roles - Permisos',
        },
      },
      {
        path: 'tipos-propiedad',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./tipos-propiedad/tipos-propiedad.component').then((m) => m.TiposPropiedadComponent),
        data: {
          title: 'Tipos - Propiedad',
        },
      }
    ],
  },
];
