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
import { HasPermissionDirective } from 'src/app/directives/has-permission.directive';

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
    MatTooltipModule,
    HasPermissionDirective
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
  selectedEditFile: File | null = null;

  createForm = new FormGroup({
    propiedad_id: new FormControl('', [Validators.required])
  });

  editForm = new FormGroup({
    id: new FormControl(''),
    propiedad_id: new FormControl('', [Validators.required]),
    url: new FormControl(''),
    useFile: new FormControl(false) // Para alternar entre archivo y URL
  });

  showCreateForm = false;
  showEditForm = false;
  editingImagenId: number | null = null;
  loading = false;
  editMode: 'file' | 'url' = 'file'; // Modo de edición

  ngOnInit(): void {
    this.loadData();
  }

  get filteredImagenes(): ImagenPropiedad[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.imagenes.filter(img =>
      img.propiedad?.titulo.toLowerCase().includes(filter) ||
      img.url.toLowerCase().includes(filter) ||
      img.id.toString().includes(filter)
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

  onEditFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    this.selectedEditFile = files && files.length > 0 ? files[0] : null;
  }

  onCreateImagen(): void {
    if (this.createForm.valid && this.selectedFiles.length > 0) {
      const newImagen: CreateImagenPropiedadRequest = {
        propiedad_id: Number(this.createForm.value.propiedad_id!),
        imagenes: this.selectedFiles
      };

      this.imagenesPropiedadService.createImagenPropiedad(newImagen).subscribe({
        next: (imagen) => {
          this.loadData(); // Recargar datos para mostrar todas las imágenes creadas
          this.createForm.reset();
          this.selectedFiles = [];
          this.showCreateForm = false;
          this.showSnackBar('Imagen(es) creada(s) exitosamente');
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
    img.src = '../../../assets/logo IHO.jpg'; // 👈 Cambia por tu imagen placeholder
  }

  // Abre la imagen en una nueva pestaña del navegador
  openImageInNewTab(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onEditImagen(imagen: ImagenPropiedad): void {
    this.editingImagenId = imagen.id;
    this.editMode = 'file'; // Por defecto usar archivo
    this.selectedEditFile = null;
    
    this.editForm.patchValue({
      id: imagen.id.toString(),
      propiedad_id: imagen.propiedad_id?.toString() || '',
      url: imagen.url,
      useFile: false
    });
    
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  toggleEditMode() {
    this.editMode = this.editMode === 'file' ? 'url' : 'file';
    this.selectedEditFile = null;
    
    // Limpiar el campo URL si se cambia a modo archivo
    if (this.editMode === 'file') {
      this.editForm.patchValue({ url: '' });
    }
  }

  onUpdateImagen(): void {
    if (this.editForm.valid && this.editingImagenId) {
      // Siempre incluir propiedad_id
      const updateData: UpdateImagenPropiedadRequest = {
        propiedad_id: Number(this.editForm.value.propiedad_id!)
      };

      // Determinar si usar archivo o URL
      if (this.editMode === 'file' && this.selectedEditFile) {
        updateData.imagen = this.selectedEditFile;
      } else if (this.editMode === 'url' && this.editForm.value.url?.trim()) {
        updateData.url = this.editForm.value.url!.trim();
      } else {
        this.showSnackBar('Seleccione un archivo o ingrese una URL válida');
        return;
      }

      console.log('Enviando datos de actualización:', updateData);

      this.imagenesPropiedadService.updateImagenPropiedad(this.editingImagenId, updateData).subscribe({
        next: (updated) => {
          const idx = this.imagenes.findIndex(img => img.id === this.editingImagenId);
          if (idx !== -1) this.imagenes[idx] = updated;
          this.cancelEdit();
          this.showSnackBar('Imagen actualizada exitosamente');
        },
        error: (err) => {
          console.error('Error actualizando imagen:', err);
          this.showSnackBar(err.error?.message || 'Error actualizando imagen');
        }
      });
    } else {
      this.showSnackBar('Formulario inválido o faltan datos');
    }
  }

  onDeleteImagen(id: number): void {
    if (confirm('¿Eliminar imagen? Esta acción también la eliminará de Cloudinary si está alojada ahí.')) {
      this.imagenesPropiedadService.deleteImagenPropiedad(id).subscribe({
        next: (response) => {
          this.imagenes = this.imagenes.filter(img => img.id !== id);
          this.showSnackBar(response.message || 'Imagen eliminada exitosamente');
        },
        error: (err) => {
          console.error(err);
          this.showSnackBar(err.error?.message || 'Error eliminando imagen');
        }
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
    this.selectedEditFile = null;
    this.editMode = 'file';
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }

  getPropiedadNameFromImagen(img: ImagenPropiedad): string {
    return img.propiedad?.titulo || `Propiedad ${img.propiedad_id}`;
  }

  // Verificar si la imagen está alojada en Cloudinary
  isCloudinaryImage(url: string): boolean {
    return url.includes('cloudinary');
  }
}