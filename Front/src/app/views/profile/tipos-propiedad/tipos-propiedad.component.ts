import { Component, OnInit, inject } from '@angular/core';
import { TiposPropiedadService, TipoPropiedad, CreateTipoPropiedadRequest, UpdateTipoPropiedadRequest } from '../../../services/tipos.service';
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
  selector: 'app-tipo-propiedad',
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
  ],
  templateUrl: './tipos-propiedad.component.html',
  styleUrls: ['./tipos-propiedad.component.scss']
})
export class TipoPropiedadComponent implements OnInit {
  private tiposService = inject(TiposPropiedadService);
  private snackBar = inject(MatSnackBar);

  tipos: TipoPropiedad[] = [];
  displayedColumns = ['id', 'nombre', 'acciones'];
  filterControl = new FormControl('');

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
  }

  get filteredTipos(): TipoPropiedad[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.tipos.filter(t =>
      t.nombre.toLowerCase().includes(filter) ||
      t.id.toString().includes(filter)
    );
  }

  loadTipos(): void {
    this.tiposService.getTipos().subscribe({
      next: (data) => this.tipos = data,
      error: () => this.showSnackBar('Error cargando tipos de propiedad')
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
          this.tipos.push(tipo);
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
          const index = this.tipos.findIndex(t => t.id === this.editingTipoId);
          if (index !== -1) this.tipos[index] = updatedTipo;
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
          this.tipos = this.tipos.filter(t => t.id !== id);
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
}
