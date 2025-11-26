import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { OperacionesService, Operacion, CreateOperacionRequest, UpdateOperacionRequest } from '../../../services/operaciones.service';
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
  selector: 'app-operaciones',
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
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss']
})
export class OperacionesComponent implements OnInit, AfterViewInit {
  private operacionesService = inject(OperacionesService);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<Operacion>([]);
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
  editingOperacionId: number | null = null;

  ngOnInit(): void {
    this.loadOperaciones();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Operacion, filter: string): boolean => {
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

  loadOperaciones(): void {
    this.loading = true;
    this.operacionesService.getOperaciones().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.showSnackBar('Error cargando operaciones');
        this.loading = false;
      }
    });
  }

  // CREAR
  onCreateOperacion(): void {
    if (this.createForm.valid) {
      const newOperacion: CreateOperacionRequest = {
        nombre: this.createForm.value.nombre!
      };
      this.operacionesService.createOperacion(newOperacion).subscribe({
        next: (operacion) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, operacion];
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Operación creada exitosamente');
        },
        error: () => this.showSnackBar('Error creando operación')
      });
    }
  }

  // EDITAR
  onEditOperacion(operacion: Operacion): void {
    this.editingOperacionId = operacion.id;
    this.editForm.patchValue({
      id: operacion.id,
      nombre: operacion.nombre
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ACTUALIZAR
  onUpdateOperacion(): void {
    if (this.editForm.valid && this.editingOperacionId) {
      const updateData: UpdateOperacionRequest = {
        nombre: this.editForm.value.nombre!
      };
      
      this.operacionesService.updateOperacion(this.editingOperacionId, updateData).subscribe({
        next: (updatedOperacion) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(o => o.id === this.editingOperacionId);
          if (index !== -1) {
            currentData[index] = updatedOperacion;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Operación actualizada exitosamente');
        },
        error: () => this.showSnackBar('Error actualizando operación')
      });
    }
  }

  // ELIMINAR
  onDeleteOperacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta operación?')) {
      this.operacionesService.deleteOperacion(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(o => o.id !== id);
          this.showSnackBar('Operación eliminada exitosamente');
        },
        error: () => this.showSnackBar('Error eliminando operación')
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
    this.editingOperacionId = null;
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
    const csvData = data.map(o => [o.id, o.nombre]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `operaciones_${new Date().toISOString().split('T')[0]}.csv`);
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

