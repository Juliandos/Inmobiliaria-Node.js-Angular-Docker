import { Component, OnInit, inject } from '@angular/core';
import { ModulosService, Modulo, CreateModuloRequest, UpdateModuloRequest } from '../../../services/modulos.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
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
export class ModulosComponent implements OnInit {
  private modulosService = inject(ModulosService);
  private snackBar = inject(MatSnackBar);

  modulos: Modulo[] = [];
  displayedColumns = ['id', 'nombre', 'permisos_count', 'acciones'];
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
  editingModuloId: number | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadModulos();
  }

  get filteredModulos(): Modulo[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.modulos.filter(m =>
      m.nombre.toLowerCase().includes(filter) ||
      m.id.toString().includes(filter)
    );
  }

  loadModulos(): void {
    this.loading = true;
    this.modulosService.getModulos().subscribe({
      next: (data) => {
        this.modulos = data;
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
          this.modulos.push(modulo);
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
          const index = this.modulos.findIndex(m => m.id === this.editingModuloId);
          if (index !== -1) {
            this.modulos[index] = updatedModulo;
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
          this.modulos = this.modulos.filter(m => m.id !== id);
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
}