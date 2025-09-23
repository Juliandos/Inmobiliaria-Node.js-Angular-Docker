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
  displayedColumns = ['id', 'imagen', 'propiedad', 'acciones'];
  filterControl = new FormControl('');
  selectedFiles: File[] = [];

  createForm = new FormGroup({
    propiedad_id: new FormControl('', [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    propiedad_id: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

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
    } catch (err) {
      console.error(err);
      this.showSnackBar('Error cargando datos');
    } finally {
      this.loading = false;
    }
  }

  startCreate() {
    if (this.showCreateForm) {
      this.toggleCreateForm(); // cierra
    } else {
      // Inicializa el formulario y abre
      this.createForm.reset();
      this.selectedFiles = [];
      this.toggleCreateForm();
    }
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.selectedFiles = files ? Array.from(files) : [];
  }

  onCreateImagen(): void {
    if (this.createForm.valid && this.selectedFiles.length > 0) {
      const newImagen: CreateImagenPropiedadRequest = {
        propiedad_id: Number(this.createForm.value.propiedad_id!),
        imagenes: this.selectedFiles
      };

      this.imagenesPropiedadService.createImagenPropiedad(newImagen).subscribe({
        next: (imagen) => {
          this.imagenes.push(imagen);
          this.createForm.reset();
          this.selectedFiles = [];
          this.showCreateForm = false;
          this.showSnackBar('Imagen creada exitosamente');
        },
        error: (err) => {
          console.error(err);
          this.showSnackBar(err.error?.message || 'Error creando imagen');
        }
      });
    } else {
      this.showSnackBar('Seleccione archivos e ID de propiedad');
    }
  }

  // Reemplaza la imagen con un placeholder si falla la carga
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '../../../assets/logo IHO.jpg'; // 👈 Usa una imagen placeholder en tu proyecto
  }

  // Abre la imagen en una nueva pestaña del navegador
  openImageInNewTab(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

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

  onUpdateImagen(): void {
    if (this.editForm.valid && this.editingImagenId) {
      const updateData: UpdateImagenPropiedadRequest = {
        propiedad_id: Number(this.editForm.value.propiedad_id!),
        url: this.editForm.value.url!
      };

      this.imagenesPropiedadService.updateImagenPropiedad(this.editingImagenId, updateData).subscribe({
        next: (updated) => {
          const idx = this.imagenes.findIndex(img => img.id === this.editingImagenId);
          if (idx !== -1) this.imagenes[idx] = updated;
          this.cancelEdit();
          this.showSnackBar('Imagen actualizada exitosamente');
        },
        error: (err) => {
          console.error(err);
          this.showSnackBar('Error actualizando imagen');
        }
      });
    }
  }

  onDeleteImagen(id: number): void {
    if (confirm('¿Eliminar imagen?')) {
      this.imagenesPropiedadService.deleteImagenPropiedad(id).subscribe({
        next: () => {
          this.imagenes = this.imagenes.filter(img => img.id !== id);
          this.showSnackBar('Imagen eliminada');
        },
        error: () => this.showSnackBar('Error eliminando imagen')
      });
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    if (this.showCreateForm) this.createForm.reset();
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingImagenId = null;
    this.editForm.reset();
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

  getPropiedadNameFromImagen(img: ImagenPropiedad): string {
    return img.propiedad?.titulo || `Propiedad ${img.propiedad_id}`;
  }
}
