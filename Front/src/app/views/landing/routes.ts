import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'Inicio'
    }
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.component').then(m => m.NosotrosComponent),
    data: {
      title: 'Sobre Nosotros'
    }
  },
  {
    path: 'contacto',
    loadComponent: () => import('./contacto/contacto.component').then(m => m.ContactoComponent),
    data: {
      title: 'Contáctenos'
    }
  },
  {
    path: 'propiedades',
    loadComponent: () => import('./propiedades-publicas/propiedades-publicas.component').then(m => m.PropiedadesPublicasComponent),
    data: {
      title: 'Propiedades Disponibles'
    }
  }
];

