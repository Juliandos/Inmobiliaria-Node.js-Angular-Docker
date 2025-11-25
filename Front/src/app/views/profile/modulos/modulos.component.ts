import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ModulosService, Modulo, CreateModuloRequest, UpdateModuloRequest } from '../../../services/modulos.service';
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
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.scss'],
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
  ]
})
export class ModulosComponent implements OnInit, AfterViewInit {
  private modulosService = inject(ModulosService);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<Modulo>([]);
  displayedColumns = ['id', 'nombre', 'permisos_count', 'acciones'];
  filterControl = new FormControl('');
  loading = false;

  // Formularios
  createForm = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required])
  });

  // Estado
  showCreateForm = false;
  showEditForm = false;
  editingModuloId: number | null = null;

  ngOnInit(): void {
    this.loadModulos();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Modulo, filter: string): boolean => {
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

  loadModulos(): void {
    this.loading = true;
    this.modulosService.getModulos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando módulos:', err);
        this.showSnackBar('Error cargando módulos');
        this.loading = false;
      }
    });
  }

  // ✅ CREAR MÓDULO
  onCreateModulo(): void {
    if (this.createForm.valid) {
      const newModulo: CreateModuloRequest = {
        nombre: this.createForm.value.nombre!
      };

      this.modulosService.createModulo(newModulo).subscribe({
        next: (modulo) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, modulo];
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Módulo creado exitosamente');
        },
        error: (err) => {
          console.error('Error creando módulo:', err);
          const message = err.error?.message || 'Error creando módulo';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditModulo(modulo: Modulo): void {
    this.editingModuloId = modulo.id;
    this.editForm.patchValue({
      id: modulo.id.toString(),
      nombre: modulo.nombre
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR MÓDULO
  onUpdateModulo(): void {
    if (this.editForm.valid && this.editingModuloId) {
      const updateData: UpdateModuloRequest = {
        nombre: this.editForm.value.nombre!
      };

      this.modulosService.updateModulo(this.editingModuloId, updateData).subscribe({
        next: (updatedModulo) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(m => m.id === this.editingModuloId);
          if (index !== -1) {
            currentData[index] = updatedModulo;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Módulo actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando módulo:', err);
          const message = err.error?.message || 'Error actualizando módulo';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ ELIMINAR MÓDULO
  onDeleteModulo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este módulo?')) {
      this.modulosService.deleteModulo(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(m => m.id !== id);
          this.showSnackBar('Módulo eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando módulo:', err);
          const message = err.error?.message || 'Error eliminando módulo';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ UTILIDADES
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    if (this.showCreateForm) {
      this.createForm.reset();
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingModuloId = null;
    this.editForm.reset();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // ✅ UTILIDADES DE TEMPLATE
  getPermisosCount(modulo: Modulo): number {
    return modulo.permisos?.length || 0;
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

    const headers = ['ID', 'Nombre', 'Cantidad de Permisos'];
    const csvData = data.map(m => [
      m.id,
      m.nombre,
      this.getPermisosCount(m)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `modulos_${new Date().toISOString().split('T')[0]}.csv`);
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