import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Página de Aterrizaje',
    title: true
  },
  {
    name: 'Home',
    url: '/landing/home',
    iconComponent: { name: 'cil-home' },
    children: [
      {
        name: 'Inicio',
        url: '/landing/home',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Sobre Nosotros',
        url: '/landing/nosotros',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Propiedades',
        url: '/landing/propiedades',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Contáctenos',
        url: '/landing/contacto',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Control de Usuario',
    title: true
  },
  {
    name: 'Profile',
    url: '/profile',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Permisos',
        url: '/profile/permisos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Usuarios',
        url: '/profile/usuarios',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Roles',
        url: '/profile/roles',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Propiedades',
        url: '/profile/propiedades',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tipos De Propiedades',
        url: '/profile/tipos-propiedad',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Módulos',
        url: '/profile/modulos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Imagenes Propiedades',
        url: '/profile/imagen-propiedad',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];
