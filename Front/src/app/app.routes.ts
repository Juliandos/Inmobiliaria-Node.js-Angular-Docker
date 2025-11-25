import { Routes } from '@angular/router';
import { DefaultLayoutComponent, PublicLayoutComponent } from './layout';
import { permissionGard } from './guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  // Rutas públicas (Landing Page - Sin autenticación)
  {
    path: 'landing',
    component: PublicLayoutComponent,
    data: {
      title: 'Landing'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./views/landing/routes').then((m) => m.routes)
      }
    ]
  },
  // Rutas protegidas (Dashboard - Con autenticación)
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [permissionGard], // Guard global para todas las rutas protegidas
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/routes').then((m) => m.routes)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'landpage',
    loadComponent: () => import('./views/pages/landpage/landpage.component').then(m => m.LandpageComponent),
    data: {
      title: 'landpage Page'
    }
  },
  { path: '**', redirectTo: 'landing' }
];
