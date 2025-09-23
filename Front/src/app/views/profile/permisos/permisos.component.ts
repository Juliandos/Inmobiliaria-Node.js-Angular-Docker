import { Component, OnInit, inject } from '@angular/core';
import { PermisosService, Permiso, CreatePermisoRequest, UpdatePermisoRequest, Modulo } from '../../../services/permisos.service';
import { RolesService, Rol } from '../../../services/roles.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
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

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule
  ]
})
export class PermisosComponent implements OnInit {
  private permisosService = inject(PermisosService);
  private rolesService = inject(RolesService);
  private snackBar = inject(MatSnackBar);

  permisos: Permiso[] = [];
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
  }

  get filteredPermisos(): Permiso[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.permisos.filter(p =>
      p.nombre.toLowerCase().includes(filter) ||
      p.id.toString().includes(filter) ||
      p.rol?.nombre.toLowerCase().includes(filter) ||
      p.modulo?.nombre.toLowerCase().includes(filter)
    );
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

      this.permisos = permisos || [];
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
          this.permisos.push(permiso);
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
          const index = this.permisos.findIndex(p => p.id === this.editingPermisoId);
          if (index !== -1) {
            this.permisos[index] = updatedPermiso;
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
          this.permisos = this.permisos.filter(p => p.id !== id);
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
}