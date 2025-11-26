import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-featured-properties',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PropertyCardComponent
  ],
  templateUrl: './featured-properties.component.html',
  styleUrls: ['./featured-properties.component.scss']
})
export class FeaturedPropertiesComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);

  propiedades: Propiedad[] = [];
  loading = false;
  limit: number = 9;

  ngOnInit(): void {
    this.loadFeaturedProperties();
  }

  private loadFeaturedProperties(): void {
    this.loading = true;
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        // Tomar las primeras 9 propiedades
        this.propiedades = (data || []).slice(0, this.limit);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando propiedades destacadas:', err);
        this.propiedades = [];
        this.loading = false;
      }
    });
  }

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }
}

