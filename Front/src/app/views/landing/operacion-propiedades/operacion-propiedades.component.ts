import { Component, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { OperacionesService, Operacion } from '../../../services/operaciones.service';
import { SearchService } from '../../../services/search.service';
import { PropertyCardComponent } from '../../../components/shared/property-card/property-card.component';
import { shareReplay, catchError } from 'rxjs/operators';
import { of, Observable, Subscription, combineLatest } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-operacion-propiedades',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    PropertyCardComponent
  ],
  templateUrl: './operacion-propiedades.component.html',
  styleUrls: ['./operacion-propiedades.component.scss']
})
export class OperacionPropiedadesComponent implements OnInit, OnDestroy {
  private propiedadesService = inject(PropiedadesService);
  private operacionesService = inject(OperacionesService);
  searchService = inject(SearchService); // Público para usar en template
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  propiedades: Propiedad[] = [];
  propiedadesFiltradas: Propiedad[] = [];
  operacion: Operacion | null = null;
  loading = false;
  operacionNombre: string = '';
  private subscriptions = new Subscription();

  ngOnInit(): void {
    // Obtener el nombre de la operación de la ruta
    this.route.params.subscribe(params => {
      this.operacionNombre = params['nombre'] || '';
      this.loadData();
    });

    // Suscribirse a los filtros de búsqueda para aplicar filtros locales
    const searchParamsSub = this.searchService.searchParams$.subscribe(params => {
      this.applyFilters();
    });
    this.subscriptions.add(searchParamsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadData(): void {
    this.loading = true;
    
    // Cargar operaciones con cache
    this.getOperacionesCached().subscribe({
      next: (operaciones) => {
        // Buscar la operación por nombre (normalizado)
        const operacionEncontrada = operaciones.find(
          op => this.normalizeString(op.nombre) === this.normalizeString(this.operacionNombre)
        );
        
        if (!operacionEncontrada) {
          // Operación no encontrada, redirigir a 404 o página de propiedades
          this.router.navigate(['/landing/propiedades']);
          return;
        }
        
        this.operacion = operacionEncontrada;
        this.cdr.markForCheck();
        
        // Cargar propiedades de esta operación (sin límite para permitir filtrado completo)
        this.propiedadesService.getPropiedadesByOperacion(operacionEncontrada.id, 100).subscribe({
          next: (data) => {
            this.propiedades = data || [];
            this.applyFilters(); // Aplicar filtros si existen
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error cargando propiedades:', err);
            this.propiedades = [];
            this.propiedadesFiltradas = [];
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error('Error cargando operaciones:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Método para obtener operaciones con cache compartido (usa método público sin auth)
  private getOperacionesCached(): Observable<Operacion[]> {
    return this.operacionesService.getOperacionesPublicas().pipe(
      catchError(err => {
        console.error('Error obteniendo operaciones:', err);
        return of([]);
      })
    );
  }

  // Normalizar string para comparación (sin acentos, minúsculas, espacios a guiones)
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // Aplicar filtros de búsqueda sobre las propiedades de esta operación
  private applyFilters(): void {
    const searchParams = this.searchService.currentParams;
    let filtered = [...this.propiedades];

    // Filtrar por término de búsqueda (título, descripción, tipo)
    if (searchParams.buscando?.trim()) {
      const termino = searchParams.buscando.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.titulo?.toLowerCase().includes(termino) ||
        p.descripcion?.toLowerCase().includes(termino) ||
        p.tipo?.nombre?.toLowerCase().includes(termino)
      );
    }

    // Filtrar por ubicación/ciudad
    if (searchParams.ubicacion?.trim()) {
      const ubicacion = searchParams.ubicacion.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.ciudad?.toLowerCase().includes(ubicacion) ||
        p.titulo?.toLowerCase().includes(ubicacion) ||
        p.descripcion?.toLowerCase().includes(ubicacion)
      );
    }

    // Si no hay filtros activos, mostrar todas las propiedades
    const hasActiveFilters = !!(searchParams.buscando?.trim()) || !!(searchParams.ubicacion?.trim());
    this.propiedadesFiltradas = hasActiveFilters ? filtered : this.propiedades;
    this.cdr.markForCheck();
  }

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }
}

