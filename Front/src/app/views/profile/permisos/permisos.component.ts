import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { PermisosService, Permiso, CreatePermisoRequest, UpdatePermisoRequest, Modulo } from '../../../services/permisos.service';
import { RolesService, Rol } from '../../../services/roles.service';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { HasPermissionDirective } from '../../../directives/has-permission.directive';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
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
    MatCheckboxModule,
    MatChipsModule,
    HasPermissionDirective
  ]
})
export class PermisosComponent implements OnInit, AfterViewInit {
  private permisosService = inject(PermisosService);
  private rolesService = inject(RolesService);
  private snackBar = inject(MatSnackBar);

  // ViewChild para paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // DataSource para la tabla
  dataSource = new MatTableDataSource<Permiso>([]);
  roles: Rol[] = [];
  modulos: Modulo[] = [];
  
  displayedColumns = ['id', 'nombre', 'rol', 'modulo', 'permisos', 'acciones'];
  filterControl = new FormControl('');

  // Formularios
  createForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    rol_id: new FormControl('', [Validators.required]),
    modulo_id: new FormControl('', [Validators.required]),
    c: new FormControl(false),
    r: new FormControl(true), // Por defecto, dar permiso de lectura
    u: new FormControl(false),
    d: new FormControl(false)
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    rol_id: new FormControl('', [Validators.required]),
    modulo_id: new FormControl('', [Validators.required]),
    c: new FormControl(false),
    r: new FormControl(false),
    u: new FormControl(false),
    d: new FormControl(false)
  });

  // Estado
  showCreateForm = false;
  showEditForm = false;
  editingPermisoId: number | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadData();
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Permiso, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return data.nombre.toLowerCase().includes(searchStr) ||
             data.id.toString().includes(searchStr) ||
             (data.rol?.nombre?.toLowerCase() || '').includes(searchStr) ||
             (data.modulo?.nombre?.toLowerCase() || '').includes(searchStr);
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
    
    // Configurar el ordenamiento personalizado para campos anidados
    this.dataSource.sortingDataAccessor = (item: Permiso, property: string) => {
      switch (property) {
        case 'rol': return item.rol?.nombre || '';
        case 'modulo': return item.modulo?.nombre || '';
        default: return (item as any)[property];
      }
    };
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      // Cargar datos en paralelo
      const [permisos, roles, modulos] = await Promise.all([
        this.permisosService.getPermisos().toPromise(),
        this.rolesService.getRoles().toPromise(),
        this.permisosService.getModulos().toPromise()
      ]);

      this.dataSource.data = permisos || [];
      this.roles = roles || [];
      this.modulos = modulos || [];
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.showSnackBar('Error cargando datos');
    } finally {
      this.loading = false;
    }
  }

  // ✅ CREAR PERMISO
  onCreatePermiso(): void {
    if (this.createForm.valid) {
      const newPermiso: CreatePermisoRequest = {
        nombre: this.createForm.value.nombre!,
        rol_id: Number(this.createForm.value.rol_id!),
        modulo_id: Number(this.createForm.value.modulo_id!),
        c: this.createForm.value.c || false,
        r: this.createForm.value.r || false,
        u: this.createForm.value.u || false,
        d: this.createForm.value.d || false
      };

      this.permisosService.createPermiso(newPermiso).subscribe({
        next: (permiso) => {
          const currentData = this.dataSource.data;
          this.dataSource.data = [...currentData, permiso];
          this.createForm.reset();
          this.createForm.patchValue({ r: true }); // Reset con lectura por defecto
          this.showCreateForm = false;
          this.showSnackBar('Permiso creado exitosamente');
        },
        error: (err) => {
          console.error('Error creando permiso:', err);
          const message = err.error?.message || 'Error creando permiso';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditPermiso(permiso: Permiso): void {
    this.editingPermisoId = permiso.id;
    this.editForm.patchValue({
      id: permiso.id.toString(),
      nombre: permiso.nombre,
      rol_id: permiso.rol_id.toString(),
      modulo_id: permiso.modulo_id.toString(),
      c: permiso.c,
      r: permiso.r,
      u: permiso.u,
      d: permiso.d
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR PERMISO
  onUpdatePermiso(): void {
    if (this.editForm.valid && this.editingPermisoId) {
      const updateData: UpdatePermisoRequest = {
        nombre: this.editForm.value.nombre!,
        rol_id: Number(this.editForm.value.rol_id!),
        modulo_id: Number(this.editForm.value.modulo_id!),
        c: this.editForm.value.c || false,
        r: this.editForm.value.r || false,
        u: this.editForm.value.u || false,
        d: this.editForm.value.d || false
      };

      this.permisosService.updatePermiso(this.editingPermisoId, updateData).subscribe({
        next: (updatedPermiso) => {
          const currentData = this.dataSource.data;
          const index = currentData.findIndex(p => p.id === this.editingPermisoId);
          if (index !== -1) {
            currentData[index] = updatedPermiso;
            this.dataSource.data = [...currentData];
          }
          this.cancelEdit();
          this.showSnackBar('Permiso actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando permiso:', err);
          const message = err.error?.message || 'Error actualizando permiso';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ ELIMINAR PERMISO
  onDeletePermiso(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este permiso?')) {
      this.permisosService.deletePermiso(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
          this.showSnackBar('Permiso eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando permiso:', err);
          this.showSnackBar('Error eliminando permiso');
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
      this.createForm.patchValue({ r: true }); // Lectura por defecto
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingPermisoId = null;
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
  getPermisosChips(permiso: Permiso): string[] {
    const chips: string[] = [];
    if (permiso.c) chips.push('Crear');
    if (permiso.r) chips.push('Leer');
    if (permiso.u) chips.push('Actualizar');
    if (permiso.d) chips.push('Eliminar');
    return chips;
  }

  getChipColor(action: string): string {
    const colors: { [key: string]: string } = {
      'Crear': 'primary',
      'Leer': 'accent',
      'Actualizar': 'warn',
      'Eliminar': ''
    };
    return colors[action] || '';
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

    const headers = ['ID', 'Nombre', 'Rol', 'Módulo', 'Crear', 'Leer', 'Actualizar', 'Eliminar'];
    const csvData = data.map(p => [
      p.id,
      p.nombre,
      p.rol?.nombre || 'N/A',
      p.modulo?.nombre || 'N/A',
      p.c ? 'Sí' : 'No',
      p.r ? 'Sí' : 'No',
      p.u ? 'Sí' : 'No',
      p.d ? 'Sí' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `permisos_${new Date().toISOString().split('T')[0]}.csv`);
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