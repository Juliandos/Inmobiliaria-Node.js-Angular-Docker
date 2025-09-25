import { Component, OnInit, inject } from '@angular/core';
import { PermisosService, Permiso, CreatePermisoRequest, UpdatePermisoRequest } from '../../../services/permisos.service';
import { RolesService, Rol } from '../../../services/roles.service';
import { PermisosAuthService } from '../../../services/permisos-auth.service';
import { HasPermissionDirective } from '../../../directives/has-permission-auth.directive';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips'; // ✅ AÑADIDO

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
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule, // ✅ AÑADIDO
    HasPermissionDirective
  ]
})
export class PermisosComponent implements OnInit {
  private permisosService = inject(PermisosService);
  private rolesService = inject(RolesService);
  private snackBar = inject(MatSnackBar);
  private permisosAuthService = inject(PermisosAuthService);

  permisos: Permiso[] = [];
  roles: Rol[] = [];
  modulos: any[] = [];
  displayedColumns = ['id', 'nombre', 'rol', 'modulo', 'permisos', 'acciones'];
  filterControl = new FormControl('');

  // Permisos del usuario actual
  canCreate = false;
  canUpdate = false;
  canDelete = false;

  // Formularios
  createForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    c: new FormControl(false),
    r: new FormControl(true), // Por defecto siempre lectura
    u: new FormControl(false),
    d: new FormControl(false),
    rol_id: new FormControl('', [Validators.required]),
    modulo_id: new FormControl('', [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    c: new FormControl(false),
    r: new FormControl(false),
    u: new FormControl(false),
    d: new FormControl(false),
    rol_id: new FormControl('', [Validators.required]),
    modulo_id: new FormControl('', [Validators.required])
  });

  showCreateForm = false;
  showEditForm = false;
  editingPermisoId: number | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadUserPermissions();
    this.loadData();
  }

  // Cargar permisos del usuario
  private loadUserPermissions(): void {
    this.permisosAuthService.hasPermission('permisos', 'c').subscribe(can => this.canCreate = can);
    this.permisosAuthService.hasPermission('permisos', 'u').subscribe(can => this.canUpdate = can);
    this.permisosAuthService.hasPermission('permisos', 'd').subscribe(can => this.canDelete = can);
  }

  get filteredPermisos(): Permiso[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.permisos.filter(p =>
      p.nombre.toLowerCase().includes(filter) ||
      p.rol?.nombre.toLowerCase().includes(filter) ||
      p.modulo?.nombre.toLowerCase().includes(filter) ||
      p.id.toString().includes(filter)
    );
  }

  loadData(): void {
    this.loading = true;
    Promise.all([
      this.permisosService.getPermisos().toPromise(),
      this.rolesService.getRoles().toPromise(),
      this.permisosService.getModulos().toPromise()
    ]).then(([permisos, roles, modulos]) => {
      this.permisos = permisos || [];
      this.roles = roles || [];
      this.modulos = modulos || [];
      this.loading = false;
    }).catch(err => {
      console.error('Error cargando datos:', err);
      this.showSnackBar('Error cargando datos');
      this.loading = false;
    });
  }

  // CREAR PERMISO
  onCreatePermiso(): void {
    if (!this.canCreate) {
      this.showSnackBar('No tienes permisos para crear');
      return;
    }

    if (this.createForm.valid) {
      const newPermiso: CreatePermisoRequest = {
        nombre: this.createForm.value.nombre!,
        c: this.createForm.value.c!,
        r: this.createForm.value.r!,
        u: this.createForm.value.u!,
        d: this.createForm.value.d!,
        rol_id: Number(this.createForm.value.rol_id!),
        modulo_id: Number(this.createForm.value.modulo_id!)
      };

      this.permisosService.createPermiso(newPermiso).subscribe({
        next: (permiso) => {
          this.permisos.push(permiso);
          this.createForm.reset();
          this.createForm.patchValue({ r: true }); // Restablecer lectura por defecto
          this.showCreateForm = false;
          this.showSnackBar('Permiso creado exitosamente');
        },
        error: (err) => {
          console.error('Error creando permiso:', err);
          this.showSnackBar('Error creando permiso');
        }
      });
    }
  }

  // EDITAR PERMISO
  onEditPermiso(permiso: Permiso): void {
    if (!this.canUpdate) {
      this.showSnackBar('No tienes permisos para editar');
      return;
    }

    this.editingPermisoId = permiso.id;
    this.editForm.patchValue({
      id: permiso.id.toString(),
      nombre: permiso.nombre,
      c: permiso.c,
      r: permiso.r,
      u: permiso.u,
      d: permiso.d,
      rol_id: permiso.rol_id.toString(),
      modulo_id: permiso.modulo_id.toString()
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ACTUALIZAR PERMISO
  onUpdatePermiso(): void {
    if (!this.canUpdate) {
      this.showSnackBar('No tienes permisos para actualizar');
      return;
    }

    if (this.editForm.valid && this.editingPermisoId) {
      const updateData: UpdatePermisoRequest = {
        nombre: this.editForm.value.nombre!,
        c: this.editForm.value.c!,
        r: this.editForm.value.r!,
        u: this.editForm.value.u!,
        d: this.editForm.value.d!,
        rol_id: Number(this.editForm.value.rol_id!),
        modulo_id: Number(this.editForm.value.modulo_id!)
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
          this.showSnackBar('Error actualizando permiso');
        }
      });
    }
  }

  // ELIMINAR PERMISO
  onDeletePermiso(id: number): void {
    if (!this.canDelete) {
      this.showSnackBar('No tienes permisos para eliminar');
      return;
    }

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

  // UTILIDADES
  toggleCreateForm(): void {
    if (!this.canCreate) {
      this.showSnackBar('No tienes permisos para crear');
      return;
    }
    
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    if (this.showCreateForm) {
      this.createForm.reset();
      this.createForm.patchValue({ r: true }); // Por defecto lectura
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

  // ✅ MÉTODOS FALTANTES PARA EL TEMPLATE
  
  // Obtener array de permisos activos para mostrar como chips
  getPermisosChips(permiso: Permiso): string[] {
    const permisos: string[] = [];
    if (permiso.c) permisos.push('Crear');
    if (permiso.r) permisos.push('Leer');
    if (permiso.u) permisos.push('Actualizar');
    if (permiso.d) permisos.push('Eliminar');
    return permisos;
  }


  // Obtener color del chip según el tipo de permiso
  getChipColor(action: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (action.toLowerCase()) {
      case 'crear': return 'primary';
      case 'leer': return 'accent';
      case 'actualizar': return 'warn';
      case 'eliminar': return 'warn';
      default: return undefined;
    }
  }

  // UTILIDADES DE TEMPLATE (existentes)
  getRolName(permiso: Permiso): string {
    return permiso.rol?.nombre || 'Sin rol';
  }

  getModuloName(permiso: Permiso): string {
    return permiso.modulo?.nombre || 'Sin módulo';
  }

  getPermisosText(permiso: Permiso): string {
    const permisos: string[] = [];
    if (permiso.c) permisos.push('C');
    if (permiso.r) permisos.push('R');
    if (permiso.u) permisos.push('U');
    if (permiso.d) permisos.push('D');
    return permisos.join(', ') || 'Ninguno';
  }
}