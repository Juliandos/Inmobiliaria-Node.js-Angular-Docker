import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule
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

  searchControl = new FormControl('');
  isLoggedIn = false; // Esto se conectará con el servicio de autenticación después
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onSearch(): void {
    const searchTerm = this.searchControl.value;
    if (searchTerm) {
      // Lógica de búsqueda
      console.log('Buscando:', searchTerm);
    }
  }
}

