import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropiedadesService } from '../../../services/propiedades.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  private propiedadesService = inject(PropiedadesService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  searchForm = new FormGroup({
    buscando: new FormControl(''),
    ubicacion: new FormControl('')
  });

  ubicaciones = [
    'Popayán',
    'Cali',
    'Bogotá',
    'Medellín',
    'Buga'
  ];

  loading = false;

  onSearch(): void {
    const formValue = this.searchForm.value;
    const buscando = formValue.buscando?.trim() || '';
    const ubicacion = formValue.ubicacion?.trim() || '';
    
    // Si ambos campos están vacíos, limpiar la búsqueda
    if (!buscando && !ubicacion) {
      this.searchService.clearSearch();
      return;
    }

    const searchParams = {
      buscando,
      ubicacion
    };

    // Actualizar parámetros de búsqueda
    this.searchService.setSearchParams(searchParams);
    this.searchService.setIsSearching(true);
    this.loading = true;

    // Ejecutar búsqueda real (usar método público sin autenticación)
    this.propiedadesService.getPropiedadesPublicas().subscribe({
      next: (propiedades) => {
        // Filtrar propiedades según los criterios de búsqueda
        let resultados = propiedades;

        // Filtrar por término de búsqueda (título, descripción, tipo)
        if (searchParams.buscando) {
          const termino = searchParams.buscando.toLowerCase();
          resultados = resultados.filter(p => 
            p.titulo?.toLowerCase().includes(termino) ||
            p.descripcion?.toLowerCase().includes(termino) ||
            p.tipo?.nombre?.toLowerCase().includes(termino)
          );
        }

        // Filtrar por ubicación (si está disponible en la descripción o título)
        if (searchParams.ubicacion) {
          const ubicacion = searchParams.ubicacion.toLowerCase();
          resultados = resultados.filter(p => 
            p.titulo?.toLowerCase().includes(ubicacion) ||
            p.descripcion?.toLowerCase().includes(ubicacion)
          );
        }

        // Actualizar resultados en el servicio
        this.searchService.setSearchResults(resultados);
        this.searchService.setIsSearching(false);
        this.loading = false;

        // Scroll suave hacia los resultados si hay resultados
        if (resultados.length > 0) {
          setTimeout(() => {
            const resultsSection = document.getElementById('search-results');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error en la búsqueda:', err);
        this.searchService.setSearchResults([]);
        this.searchService.setIsSearching(false);
        this.loading = false;
      }
    });
  }
}

