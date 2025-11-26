import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class LandingFooterComponent {
  descubrirLinks = [
    { label: 'Popayán', route: '/landing/propiedades', queryParams: { ubicacion: 'Popayán' } },
    { label: 'Cali', route: '/landing/propiedades', queryParams: { ubicacion: 'Cali' } },
    { label: 'Bogotá', route: '/landing/propiedades', queryParams: { ubicacion: 'Bogotá' } },
    { label: 'Medellín', route: '/landing/propiedades', queryParams: { ubicacion: 'Medellín' } },
    { label: 'Buga', route: '/landing/propiedades', queryParams: { ubicacion: 'Buga' } }
  ];

  linksInteres = [
    { label: 'Inicio', route: '/landing/home' },
    { label: 'Comprar', route: '/landing/propiedades', queryParams: { tipo: 'venta' } },
    { label: 'Arrendar', route: '/landing/propiedades', queryParams: { tipo: 'arriendo' } },
    { label: 'Nosotros', route: '/landing/nosotros' },
    { label: 'Contacto', route: '/landing/contacto' }
  ];

  contactos = [
    {
      ciudad: 'Popayán Cauca',
      direccion1: 'Cra. 10 BIS # 22N-41',
      direccion2: 'Barrio Urapanes de Catay',
      email: 'correo@gmail.com',
      telefono: '3116242561'
    },
    {
      ciudad: 'Bogotá Cundinamarca',
      direccion1: 'Cra. 10 BIS #22N-41',
      direccion2: 'Barrio Urapanes de Catay'
    }
  ];

  socialLinks = [
    { icon: 'facebook', label: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
    { icon: 'photo_camera', label: 'Instagram', url: 'https://instagram.com', color: '#E4405F' },
    { icon: 'chat', label: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { icon: 'work', label: 'LinkedIn', url: 'https://linkedin.com', color: '#0077B5' },
    { icon: 'play_circle', label: 'YouTube', url: 'https://youtube.com', color: '#FF0000' },
    { icon: 'code', label: 'GitHub', url: 'https://github.com', color: '#181717' }
  ];
}

