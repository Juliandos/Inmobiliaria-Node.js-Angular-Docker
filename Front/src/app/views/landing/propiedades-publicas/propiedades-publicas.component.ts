import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-propiedades-publicas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    PropertyCardComponent
  ],
  templateUrl: './propiedades-publicas.component.html',
  styleUrls: ['./propiedades-publicas.component.scss']
})
export class PropiedadesPublicasComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);
  
  propiedades: Propiedad[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadPropiedades();
  }

  loadPropiedades(): void {
    this.loading = true;
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        console.log('Propiedades cargadas:', data);
        this.propiedades = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando propiedades:', err);
        this.propiedades = [];
        this.loading = false;
      }
    });
  }

  formatPrice(price?: number): string {
    if (!price) return 'Consultar precio';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatArea(area?: number): string {
    if (!area) return 'N/A';
    return `${area} m²`;
  }

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }
}

