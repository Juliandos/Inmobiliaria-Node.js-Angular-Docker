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
