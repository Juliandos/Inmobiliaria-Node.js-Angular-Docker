import { Component, OnInit, inject } from '@angular/core';
import { RolesService, Rol, CreateRolRequest, UpdateRolRequest } from '../../../services/roles.service';
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
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
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
    MatSelectModule
  ]
})
export class RolesComponent implements OnInit {
  private rolesService = inject(RolesService);
  private snackBar = inject(MatSnackBar);

  roles: Rol[] = [];
  displayedColumns = ['id', 'nombre', 'acciones'];
  filterControl = new FormControl('');

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
  }

  get filteredRoles(): Rol[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.roles.filter(r =>
      r.nombre.toLowerCase().includes(filter) ||
      r.id.toString().includes(filter)
    );
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.showSnackBar('Error cargando roles');
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
          this.roles.push(rol);
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
          const index = this.roles.findIndex(r => r.id === this.editingRoleId);
          if (index !== -1) {
            this.roles[index] = updatedRol;
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
          this.roles = this.roles.filter(r => r.id !== id);
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
}
