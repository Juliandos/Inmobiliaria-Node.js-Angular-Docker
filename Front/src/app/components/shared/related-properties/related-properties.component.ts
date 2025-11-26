import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-related-properties',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PropertyCardComponent
  ],
  templateUrl: './related-properties.component.html',
  styleUrls: ['./related-properties.component.scss']
})
export class RelatedPropertiesComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);

  @Input() excludeId?: number; // ID de la propiedad actual para excluirla
  @Input() limit: number = 9; // Número de propiedades a mostrar

  propiedades: Propiedad[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadRelatedProperties();
  }

  private loadRelatedProperties(): void {
    this.loading = true;
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        // Filtrar la propiedad actual y tomar las primeras 9
        this.propiedades = (data || [])
          .filter(p => p.id !== this.excludeId)
          .slice(0, this.limit);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando propiedades relacionadas:', err);
        this.propiedades = [];
        this.loading = false;
      }
    });
  }

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }
}

