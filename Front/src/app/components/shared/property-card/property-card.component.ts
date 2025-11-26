import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Propiedad } from '../../../services/propiedades.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() propiedad!: Propiedad;

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

  getMainImage(): string {
    if (this.propiedad.imagenes_propiedads && this.propiedad.imagenes_propiedads.length > 0) {
      return this.propiedad.imagenes_propiedads[0].url;
    }
    return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  }
}

