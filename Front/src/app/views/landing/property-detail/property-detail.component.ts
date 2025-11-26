import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { MinimalCarouselComponent } from '../minimal-carousel/minimal-carousel.component';
import { PropertyImagesCarouselComponent } from '../property-images-carousel/property-images-carousel.component';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MinimalCarouselComponent,
    PropertyImagesCarouselComponent,
    GoogleMapsComponent
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propiedadesService = inject(PropiedadesService);

  propiedad: Propiedad | null = null;
  loading = true;
  displayedColumns: string[] = ['label', 'value'];

  // Carousel images for minimal carousel
  carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      alt: 'Propiedad'
    }
  ];

  propertyData: { label: string; value: string; icon: string }[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(+id);
    }
  }

  loadProperty(id: number): void {
    this.loading = true;
    this.propiedadesService.getPropiedad(id).subscribe({
      next: (propiedad) => {
        this.propiedad = propiedad;
        this.setupPropertyData();
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/landing/propiedades']);
      }
    });
  }

  setupPropertyData(): void {
    if (!this.propiedad) return;

    this.propertyData = [
      { label: 'Tipo', value: this.propiedad.tipo?.nombre || 'N/A', icon: 'category' },
      { label: 'Precio', value: this.formatPrice(this.propiedad.precio), icon: 'attach_money' },
      { label: 'Área', value: this.formatArea(this.propiedad.area), icon: 'square_foot' },
      { label: 'Habitaciones', value: String(this.propiedad.habitaciones || 0), icon: 'bed' },
      { label: 'Baños', value: String(this.propiedad.banos || 0), icon: 'bathtub' },
      { label: 'Parqueaderos', value: String(this.propiedad.parqueadero || 0), icon: 'garage' },
      { label: 'Vendedor', value: this.propiedad.usuario ? `${this.propiedad.usuario.nombre} ${this.propiedad.usuario.apellido}` : 'N/A', icon: 'person' }
    ];
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

  getPropertyImages(): { id: number; url: string }[] {
    if (this.propiedad?.imagenes_propiedads) {
      return this.propiedad.imagenes_propiedads;
    }
    return [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }];
  }
}

