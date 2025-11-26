import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Propiedad } from '../../../services/propiedades.service';
import { SearchService } from '../../../services/search.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PropertyCardComponent
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  private searchService = inject(SearchService);

  propiedades: Propiedad[] = [];
  searchParams: { buscando?: string; ubicacion?: string } = {};
  isSearching = false;
  hasSearched = false;

  ngOnInit(): void {
    // Suscribirse a los parámetros de búsqueda primero
    this.searchService.searchParams$.subscribe(params => {
      this.searchParams = params;
      // Solo mostrar resultados si hay parámetros de búsqueda activos
      const hasSearchParams = !!(params.buscando?.trim()) || !!(params.ubicacion?.trim());
      this.hasSearched = hasSearchParams;
    });

    // Suscribirse a los resultados de búsqueda
    this.searchService.searchResults$.subscribe(results => {
      this.propiedades = results;
    });

    // Suscribirse al estado de búsqueda
    this.searchService.isSearching$.subscribe(isSearching => {
      this.isSearching = isSearching;
    });
  }

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }

  getSearchSummary(): string {
    const parts: string[] = [];
    if (this.searchParams.buscando) {
      parts.push(`"${this.searchParams.buscando}"`);
    }
    if (this.searchParams.ubicacion) {
      parts.push(`en ${this.searchParams.ubicacion}`);
    }
    return parts.join(' ');
  }
}

