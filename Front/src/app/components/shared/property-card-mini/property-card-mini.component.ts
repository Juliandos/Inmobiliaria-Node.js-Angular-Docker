import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Propiedad } from '../../../services/propiedades.service';

@Component({
  selector: 'app-property-card-mini',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './property-card-mini.component.html',
  styleUrls: ['./property-card-mini.component.scss']
})
export class PropertyCardMiniComponent {
  @Input() propiedad!: Propiedad;

  formatPrice(price?: number): string {
    if (!price) return 'Consultar';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatArea(area?: number): string {
    if (!area) return '';
    return `${area} m²`;
  }

  getMainImage(): string {
    if (this.propiedad.imagenes_propiedads && this.propiedad.imagenes_propiedads.length > 0) {
      return this.propiedad.imagenes_propiedads[0].url;
    }
    return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }
}

