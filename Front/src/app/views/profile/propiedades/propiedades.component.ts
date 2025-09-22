import { Component, OnInit, inject } from '@angular/core';
import { PropiedadesService, Propiedad, CreatePropiedadRequest, UpdatePropiedadRequest } from '../../../services/propiedades.service';
import { TiposPropiedadService, TipoPropiedad } from '../../../services/tipos.service';
import { UsuariosService, Usuario } from '../../../services/usuarios.service';
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
  selector: 'app-propiedades',
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
    MatTooltipModule
  ],
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss']
})
export class PropiedadesComponent implements OnInit {
  private propiedadesService = inject(PropiedadesService);
  private tiposService = inject(TiposPropiedadService);
  private usuariosService = inject(UsuariosService);
  private snackBar = inject(MatSnackBar);

  propiedades: Propiedad[] = [];
  tipos: TipoPropiedad[] = [];
  usuarios: Usuario[] = [];
  displayedColumns = ['id', 'titulo', 'tipo', 'precio', 'usuario', 'habitaciones', 'acciones'];
  filterControl = new FormControl('');

  // Formularios
  createForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    precio: new FormControl<number | null>(null),
    habitaciones: new FormControl<number | null>(null),
    banos: new FormControl<number | null>(null),
    parqueadero: new FormControl<number | null>(null),
    tipo_id: new FormControl<number | null>(null),
    usuario_id: new FormControl<number | null>(null)
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    precio: new FormControl<number | null>(null),
    habitaciones: new FormControl<number | null>(null),
    banos: new FormControl<number | null>(null),
    parqueadero: new FormControl<number | null>(null),
    tipo_id: new FormControl<number | null>(null),
    usuario_id: new FormControl<number | null>(null)
  });

  // Estado
  showCreateForm = false;
  showEditForm = false;
  editingPropiedadId: number | null = null;

  ngOnInit(): void {
    this.loadPropiedades();
    this.loadTipos();
    this.loadUsuarios();
  }

  get filteredPropiedades(): Propiedad[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.propiedades.filter(p =>
      p.titulo.toLowerCase().includes(filter) ||
      p.id.toString().includes(filter) ||
      (p.tipo?.nombre || '').toLowerCase().includes(filter) ||
      (p.usuario?.nombre || '').toLowerCase().includes(filter)
    );
  }

  loadPropiedades(): void {
    this.propiedadesService.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data;
        console.log('Propiedades cargadas:', data);
      },
      error: (err) => {
        console.error('Error cargando propiedades:', err);
        this.showSnackBar('Error cargando propiedades');
      }
    });
  }

  loadTipos(): void {
    this.tiposService.getTipos().subscribe({
      next: (data) => {
        this.tipos = data;
        console.log('Tipos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando tipos:', err);
        this.showSnackBar('Error cargando tipos de propiedad');
      }
    });
  }

  loadUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.showSnackBar('Error cargando usuarios');
      }
    });
  }

  // ✅ CREAR PROPIEDAD
  onCreatePropiedad(): void {
    if (this.createForm.valid) {
      const newPropiedad: CreatePropiedadRequest = {
        titulo: this.createForm.value.titulo!,
        descripcion: this.createForm.value.descripcion || undefined,
        precio: this.createForm.value.precio || undefined,
        habitaciones: this.createForm.value.habitaciones || undefined,
        banos: this.createForm.value.banos || undefined,
        parqueadero: this.createForm.value.parqueadero || undefined,
        tipo_id: this.createForm.value.tipo_id || undefined,
        usuario_id: this.createForm.value.usuario_id || undefined
      };

      this.propiedadesService.createPropiedad(newPropiedad).subscribe({
        next: (propiedad) => {
          this.propiedades.push(propiedad);
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Propiedad creada exitosamente');
        },
        error: (err) => {
          console.error('Error creando propiedad:', err);
          this.showSnackBar('Error creando propiedad');
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditPropiedad(propiedad: Propiedad): void {
    this.editingPropiedadId = propiedad.id;
    this.editForm.patchValue({
      id: propiedad.id.toString(),
      titulo: propiedad.titulo,
      descripcion: propiedad.descripcion || '',
      precio: propiedad.precio || null,
      habitaciones: propiedad.habitaciones || null,
      banos: propiedad.banos || null,
      parqueadero: propiedad.parqueadero || null,
      tipo_id: propiedad.tipo_id || null,
      usuario_id: propiedad.usuario_id || null
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR PROPIEDAD
  onUpdatePropiedad(): void {
    if (this.editForm.valid && this.editingPropiedadId) {
      const updateData: UpdatePropiedadRequest = {
        titulo: this.editForm.value.titulo!,
        descripcion: this.editForm.value.descripcion || undefined,
        precio: this.editForm.value.precio || undefined,
        habitaciones: this.editForm.value.habitaciones || undefined,
        banos: this.editForm.value.banos || undefined,
        parqueadero: this.editForm.value.parqueadero || undefined,
        tipo_id: this.editForm.value.tipo_id || undefined,
        usuario_id: this.editForm.value.usuario_id || undefined
      };

      this.propiedadesService.updatePropiedad(this.editingPropiedadId, updateData).subscribe({
        next: (updatedPropiedad) => {
          const index = this.propiedades.findIndex(p => p.id === this.editingPropiedadId);
          if (index !== -1) {
            this.propiedades[index] = updatedPropiedad;
          }
          this.cancelEdit();
          this.showSnackBar('Propiedad actualizada exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando propiedad:', err);
          this.showSnackBar('Error actualizando propiedad');
        }
      });
    }
  }

  // ✅ ELIMINAR PROPIEDAD
  onDeletePropiedad(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      this.propiedadesService.deletePropiedad(id).subscribe({
        next: () => {
          this.propiedades = this.propiedades.filter(p => p.id !== id);
          this.showSnackBar('Propiedad eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando propiedad:', err);
          this.showSnackBar('Error eliminando propiedad');
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
    this.editingPropiedadId = null;
    this.editForm.reset();
  }

  getTipoName(tipoId?: number): string {
    if (!tipoId) return 'Sin tipo';
    const tipo = this.tipos.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : `Tipo ${tipoId}`;
  }

  getUsuarioName(usuarioId?: number): string {
    if (!usuarioId) return 'Sin usuario';
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario ${usuarioId}`;
  }

  getTipoNameFromPropiedad(propiedad: Propiedad): string {
    // Primero intentar obtener de la relación incluida
    if (propiedad.tipo?.nombre) {
      return propiedad.tipo.nombre;
    }
    // Si no, buscar en la lista local
    return this.getTipoName(propiedad.tipo_id);
  }

  getUsuarioNameFromPropiedad(propiedad: Propiedad): string {
    // Primero intentar obtener de la relación incluida
    if (propiedad.usuario?.nombre) {
      return `${propiedad.usuario.nombre} ${propiedad.usuario.apellido || ''}`.trim();
    }
    // Si no, buscar en la lista local
    return this.getUsuarioName(propiedad.usuario_id);
  }

  formatPrice(price?: number): string {
    if (!price) return 'No especificado';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}