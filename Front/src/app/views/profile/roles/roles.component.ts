import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { RolesService, Rol, CreateRolRequest, UpdateRolRequest } from '../../../services/roles.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasPermissionDirective } from 'src/app/directives/has-permission.directive';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
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
    MatSelectModule,
    HasPermissionDirective
  ]
})
export class RolesComponent implements OnInit, AfterViewInit {
  private rolesService = inject(RolesService);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<Rol>([]);
  displayedColumns = ['id', 'nombre', 'acciones'];
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
  editingRoleId: number | null = null;

  ngOnInit(): void {
    this.loadRoles();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Rol, filter: string): boolean => {
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

  loadRoles(): void {
    this.loading = true;
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.showSnackBar('Error cargando roles');
        this.loading = false;
      }
    });
  }

  // ✅ CREAR ROL
  onCreateRol(): void {
    if (this.createForm.valid) {
      const newRol: CreateRolRequest = {
        nombre: this.createForm.value.nombre!
      };

      this.rolesService.createRol(newRol).subscribe({
        next: (rol) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, rol];
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Rol creado exitosamente');
        },
        error: (err) => {
          console.error('Error creando rol:', err);
          this.showSnackBar('Error creando rol');
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditRol(rol: Rol): void {
    this.editingRoleId = rol.id;
    this.editForm.patchValue({
      id: rol.id.toString(),
      nombre: rol.nombre
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR ROL
  onUpdateRol(): void {
    if (this.editForm.valid && this.editingRoleId) {
      const updateData: UpdateRolRequest = {
        nombre: this.editForm.value.nombre!
      };

      this.rolesService.updateRol(this.editingRoleId, updateData).subscribe({
        next: (updatedRol) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(r => r.id === this.editingRoleId);
          if (index !== -1) {
            currentData[index] = updatedRol;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Rol actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando rol:', err);
          this.showSnackBar('Error actualizando rol');
        }
      });
    }
  }

  // ✅ ELIMINAR ROL
  onDeleteRol(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.rolesService.deleteRol(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(r => r.id !== id);
          this.showSnackBar('Rol eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando rol:', err);
          this.showSnackBar('Error eliminando rol');
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
    this.editingRoleId = null;
    this.editForm.reset();
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
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
    const csvData = data.map(r => [r.id, r.nombre]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `roles_${new Date().toISOString().split('T')[0]}.csv`);
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
