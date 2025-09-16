import { Routes } from '@angular/router';

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
        loadComponent: () =>
          import('./roles/roles.component').then((m) => m.RolesComponent),
        data: {
          title: 'Roles',
        },
      },
      {
        path: 'usuariosv',
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
        loadComponent: () =>
          import('./tipos-propiedad/tipos-propiedad.component').then((m) => m.TiposPropiedadComponent),
        data: {
          title: 'Tipos - Propiedad',
        },
      }
    ],
  },
];
