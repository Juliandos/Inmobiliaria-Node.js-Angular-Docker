import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ImagenesPropiedadService, ImagenPropiedad } from '../../../services/imagen-propiedad.service';

@Component({
  selector: 'app-landpage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.scss']
})
export class LandpageComponent implements OnInit {
  private imagenesPropiedadService = inject(ImagenesPropiedadService);

  imagenes: ImagenPropiedad[] = [];
  filterControl = new FormControl('');

  ngOnInit(): void {
    this.loadImagenes();
  }

  async loadImagenes(): Promise<void> {
    try {
      const imagenes = await this.imagenesPropiedadService.getImagenesPropiedad().toPromise();
      this.imagenes = imagenes || [];
    } catch (err) {
      console.error('Error cargando imágenes', err);
    }
  }

  // ✅ Getter para filtrar imágenes dinámicamente
  get filteredImagenes(): ImagenPropiedad[] {
    const filter = this.filterControl.value?.toLowerCase() || '';
    return this.imagenes.filter(img =>
      img.propiedad?.titulo?.toLowerCase().includes(filter) ||
      img.url?.toLowerCase().includes(filter) ||
      img.id?.toString().includes(filter)
    );
  }
}
