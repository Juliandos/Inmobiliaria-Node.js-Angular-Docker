import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { TiposPropiedadService, TipoPropiedad, CreateTipoPropiedadRequest, UpdateTipoPropiedadRequest } from '../../../services/tipos.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasPermissionDirective } from 'src/app/directives/has-permission.directive';

@Component({
  selector: 'app-tipo-propiedad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    HasPermissionDirective
  ],
  templateUrl: './tipos-propiedad.component.html',
  styleUrls: ['./tipos-propiedad.component.scss']
})
export class TipoPropiedadComponent implements OnInit, AfterViewInit {
  private tiposService = inject(TiposPropiedadService);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<TipoPropiedad>([]);
  displayedColumns = ['id', 'nombre', 'acciones'];
  filterControl = new FormControl('');
  loading = false;

  // Formularios
  createForm = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required])
  });

  // Estado
  showCreateForm = false;
  showEditForm = false;
  editingTipoId: number | null = null;

  ngOnInit(): void {
    this.loadTipos();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: TipoPropiedad, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return data.nombre.toLowerCase().includes(searchStr) ||
             data.id.toString().includes(searchStr);
    };

    // Suscribirse a cambios en el filtro
    this.filterControl.valueChanges.subscribe(value => {
      this.dataSource.filter = value?.trim().toLowerCase() || '';
    });
  }

  ngAfterViewInit(): void {
    // Configurar paginador y ordenamiento después de que la vista se inicialice
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTipos(): void {
    this.loading = true;
    this.tiposService.getTipos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.showSnackBar('Error cargando tipos de propiedad');
        this.loading = false;
      }
    });
  }

  // CREAR
  onCreateTipo(): void {
    if (this.createForm.valid) {
      const newTipo: CreateTipoPropiedadRequest = {
        nombre: this.createForm.value.nombre!
      };
      this.tiposService.createTipo(newTipo).subscribe({
        next: (tipo) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, tipo];
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Tipo de propiedad creado exitosamente');
        },
        error: () => this.showSnackBar('Error creando tipo de propiedad')
      });
    }
  }

  // EDITAR
  onEditTipo(tipo: TipoPropiedad): void {
    this.editingTipoId = tipo.id;
    this.editForm.patchValue({
      id: tipo.id,
      nombre: tipo.nombre
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ACTUALIZAR
  onUpdateTipo(): void {
    if (this.editForm.valid && this.editingTipoId) {
      const updateData: UpdateTipoPropiedadRequest = {
        nombre: this.editForm.value.nombre!
      };
      
      this.tiposService.updateTipo(this.editingTipoId, updateData).subscribe({
        next: (updatedTipo) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(t => t.id === this.editingTipoId);
          if (index !== -1) {
            currentData[index] = updatedTipo;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Tipo de propiedad actualizado exitosamente');
        },
        error: () => this.showSnackBar('Error actualizando tipo de propiedad')
      });
    }
  }

  // ELIMINAR
  onDeleteTipo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de propiedad?')) {
      this.tiposService.deleteTipo(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(t => t.id !== id);
          this.showSnackBar('Tipo de propiedad eliminado exitosamente');
        },
        error: () => this.showSnackBar('Error eliminando tipo de propiedad')
      });
    }
  }

  // UTILIDADES
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    if (this.showCreateForm) this.createForm.reset();
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingTipoId = null;
    this.editForm.reset();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  // ✅ LIMPIAR FILTRO
  clearFilter(): void {
    this.filterControl.setValue('');
  }

  // ✅ EXPORTAR A CSV
  exportToCSV(): void {
    const data = this.dataSource.filteredData;
    if (data.length === 0) {
      this.showSnackBar('No hay datos para exportar');
      return;
    }

    const headers = ['ID', 'Nombre'];
    const csvData = data.map(t => [t.id, t.nombre]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tipos_propiedad_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showSnackBar('Datos exportados correctamente');
  }

  // ✅ OBTENER TOTAL DE REGISTROS
  getTotalRecords(): number {
    return this.dataSource.data.length;
  }

  // ✅ OBTENER REGISTROS FILTRADOS
  getFilteredRecords(): number {
    return this.dataSource.filteredData.length;
  }
}
