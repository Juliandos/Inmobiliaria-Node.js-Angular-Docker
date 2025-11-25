import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class LandingHeaderComponent {
  menuItems = [
    { label: 'Comprar', route: '/landing/propiedades', queryParams: { tipo: 'venta' } },
    { label: 'Arrendar', route: '/landing/propiedades', queryParams: { tipo: 'arriendo' } },
    { label: 'Nosotros', route: '/landing/nosotros' },
    { label: 'Contacto', route: '/landing/contacto' }
  ];
}

