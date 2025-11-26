import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
import { OperacionesService, Operacion } from '../../../services/operaciones.service';
import { PropertyCardComponent } from '../property-card/property-card.component';
import { shareReplay, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
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
export class OperacionPropiedadesComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);
  private operacionesService = inject(OperacionesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  propiedades: Propiedad[] = [];
  operacion: Operacion | null = null;
  loading = false;
  operacionNombre: string = '';

  ngOnInit(): void {
    // Obtener el nombre de la operación de la ruta
    this.route.params.subscribe(params => {
      this.operacionNombre = params['nombre'] || '';
      this.loadData();
    });
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
        
        // Cargar propiedades de esta operación (máximo 10)
        this.propiedadesService.getPropiedadesByOperacion(operacionEncontrada.id, 10).subscribe({
          next: (data) => {
            this.propiedades = data || [];
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error cargando propiedades:', err);
            this.propiedades = [];
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

  trackByPropiedadId(index: number, propiedad: Propiedad): number {
    return propiedad.id;
  }
}

