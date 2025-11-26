import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OperacionesService, Operacion } from '../../../services/operaciones.service';

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
export class LandingHeaderComponent implements OnInit {
  private operacionesService = inject(OperacionesService);
  private router = inject(Router);
  
  menuItems: { label: string; route: string; queryParams?: any }[] = [];
  operacionesMenuItems: { label: string; route: string }[] = [];
  
  searchControl = new FormControl('');
  isLoggedIn = false; // Esto se conectará con el servicio de autenticación después
  mobileMenuOpen = false;
  loadingOperaciones = true;
  
  // Normalizar nombre para URL (sin acentos, espacios a guiones, minúsculas)
  normalizeRouteName(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  ngOnInit(): void {
    // Cargar operaciones dinámicamente
    this.loadOperaciones();
    
    // Menú estático (siempre visible)
    this.menuItems = [
      { label: 'Nosotros', route: '/landing/nosotros' },
      { label: 'Contacto', route: '/landing/contacto' }
    ];
  }

  private loadOperaciones(): void {
    this.loadingOperaciones = true;
    console.log('🔄 Cargando operaciones...');
    this.operacionesService.getOperacionesPublicas().subscribe({
      next: (operaciones) => {
        console.log('✅ Operaciones cargadas exitosamente:', operaciones);
        console.log('📊 Cantidad de operaciones:', operaciones.length);
        // Generar links dinámicos para cada operación
        this.operacionesMenuItems = operaciones.map(op => ({
          label: op.nombre,
          route: `/landing/operacion/${this.normalizeRouteName(op.nombre)}`
        }));
        console.log('🔗 Items del menú generados:', this.operacionesMenuItems);
        this.loadingOperaciones = false;
      },
      error: (err) => {
        console.error('❌ Error cargando operaciones:', err);
        console.error('📋 Detalles del error:', JSON.stringify(err, null, 2));
        this.loadingOperaciones = false;
      }
    });
  }


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

  navigateToOperacion(route: string): void {
    this.closeMobileMenu();
    this.router.navigateByUrl(route);
  }
}

