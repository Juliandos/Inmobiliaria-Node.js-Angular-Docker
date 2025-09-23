import { Component, OnInit, inject } from '@angular/core';
import { ImagenesPropiedadService, ImagenPropiedad, CreateImagenPropiedadRequest, UpdateImagenPropiedadRequest } from '../../../services/imagen-propiedad.service';
import { PropiedadesService, Propiedad } from '../../../services/propiedades.service';
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
  selector: 'app-imagen-propiedad',
  templateUrl: './imagen-propiedad.component.html',
  styleUrls: ['./imagen-propiedad.component.scss'],
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
  ]
})
export class ImagenPropiedadComponent implements OnInit {
  private imagenesPropiedadService = inject(ImagenesPropiedadService);
  private propiedadesService = inject(PropiedadesService);
  private snackBar = inject(MatSnackBar);

  imagenes: ImagenPropiedad[] = [];
  propiedades: Propiedad[] = [];
  displayedColumns = ['id', 'imagen', 'url', 'propiedad', 'acciones'];
  filterControl = new FormControl('');

  // Formularios
  createForm = new FormGroup({
    propiedad_id: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/.+/)])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    propiedad_id: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern(/^https?:\/\/.+/)])
  });

  // Estado
  showCreateForm = false;
  showEditForm = false;
  editingImagenId: number | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  get filteredImagenes(): ImagenPropiedad[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.imagenes.filter(img =>
      img.id.toString().includes(filter) ||
      img.url.toLowerCase().includes(filter) ||
      img.propiedad?.titulo.toLowerCase().includes(filter)
    );
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      const [imagenes, propiedades] = await Promise.all([
        this.imagenesPropiedadService.getImagenesPropiedad().toPromise(),
        this.propiedadesService.getPropiedades().toPromise()
      ]);

      this.imagenes = imagenes || [];
      this.propiedades = propiedades || [];
    } catch (error) {
      console.error('Error cargando datos:', error);
      this.showSnackBar('Error cargando datos');
    } finally {
      this.loading = false;
    }
  }

  // ✅ CREAR IMAGEN
  onCreateImagen(): void {
    if (this.createForm.valid) {
      const newImagen: CreateImagenPropiedadRequest = {
        propiedad_id: Number(this.createForm.value.propiedad_id!),
        url: this.createForm.value.url!
      };

      this.imagenesPropiedadService.createImagenPropiedad(newImagen).subscribe({
        next: (imagen) => {
          this.imagenes.push(imagen);
          this.createForm.reset();
          this.showCreateForm = false;
          this.showSnackBar('Imagen creada exitosamente');
        },
        error: (err) => {
          console.error('Error creando imagen:', err);
          const message = err.error?.message || 'Error creando imagen';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ PREPARAR EDICIÓN
  onEditImagen(imagen: ImagenPropiedad): void {
    this.editingImagenId = imagen.id;
    this.editForm.patchValue({
      id: imagen.id.toString(),
      propiedad_id: imagen.propiedad_id?.toString() || '',
      url: imagen.url
    });
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  // ✅ ACTUALIZAR IMAGEN
  onUpdateImagen(): void {
    if (this.editForm.valid && this.editingImagenId) {
      const updateData: UpdateImagenPropiedadRequest = {
        propiedad_id: Number(this.editForm.value.propiedad_id!),
        url: this.editForm.value.url!
      };

      this.imagenesPropiedadService.updateImagenPropiedad(this.editingImagenId, updateData).subscribe({
        next: (updatedImagen) => {
          const index = this.imagenes.findIndex(img => img.id === this.editingImagenId);
          if (index !== -1) {
            this.imagenes[index] = updatedImagen;
          }
          this.cancelEdit();
          this.showSnackBar('Imagen actualizada exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando imagen:', err);
          const message = err.error?.message || 'Error actualizando imagen';
          this.showSnackBar(message);
        }
      });
    }
  }

  // ✅ ELIMINAR IMAGEN
  onDeleteImagen(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      this.imagenesPropiedadService.deleteImagenPropiedad(id).subscribe({
        next: () => {
          this.imagenes = this.imagenes.filter(img => img.id !== id);
          this.showSnackBar('Imagen eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error eliminando imagen:', err);
          this.showSnackBar('Error eliminando imagen');
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
    this.editingImagenId = null;
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
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  openImageInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  getPropiedadName(propiedadId?: number): string {
    if (!propiedadId) return 'Sin propiedad';
    const propiedad = this.propiedades.find(p => p.id === propiedadId);
    return propiedad ? propiedad.titulo : `Propiedad ${propiedadId}`;
  }

  getPropiedadNameFromImagen(imagen: ImagenPropiedad): string {
    // Primero intentar obtener de la relación incluida
    if (imagen.propiedad?.titulo) {
      return imagen.propiedad.titulo;
    }
    // Si no, buscar en la lista local
    return this.getPropiedadName(imagen.propiedad_id);
  }
}