import { Routes } from '@angular/router';
import { LandingLayoutComponent } from './layout/landing-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
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
        path: 'avaluos-ia',
        loadComponent: () => import('./avaluos-ia/avaluos-ia.component').then(m => m.AvaluosIaComponent),
        data: {
          title: 'Avalúos IA'
        }
      },
      {
        path: 'propiedades',
        loadComponent: () => import('./propiedades-publicas/propiedades-publicas.component').then(m => m.PropiedadesPublicasComponent),
        data: {
          title: 'Propiedades Disponibles'
        }
      },
      {
        path: 'propiedad/:id',
        loadComponent: () => import('./property-detail/property-detail.component').then(m => m.PropertyDetailComponent),
        data: {
          title: 'Detalle de Propiedad'
        }
      },
      {
        path: 'operacion/:nombre',
        loadComponent: () => import('./operacion-propiedades/operacion-propiedades.component').then(m => m.OperacionPropiedadesComponent),
        data: {
          title: 'Propiedades por Operación'
        }
      }
    ]
  }
];

