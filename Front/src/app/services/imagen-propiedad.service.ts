import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ImagenPropiedad {
  id: number;
  propiedad_id?: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  propiedad?: {
    id: number;
    titulo: string;
  };
}

export interface CreateImagenPropiedadRequest {
  propiedad_id: number;
  imagenes: File[]; // ahora un array de archivos
}

export interface UpdateImagenPropiedadRequest {
  propiedad_id?: number;
  url?: string;
  imagen?: File; // archivo opcional para actualización
}

@Injectable({
  providedIn: 'root'
})
export class ImagenesPropiedadService {
  private apiUrl = 'http://localhost:3001/imagen-propiedad';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todas las imágenes
  getImagenesPropiedad(): Observable<ImagenPropiedad[]> {
    return this.http.get<ImagenPropiedad[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error obteniendo imágenes:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener una imagen por ID
  getImagenPropiedad(id: number): Observable<ImagenPropiedad> {
    return this.http.get<ImagenPropiedad>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error obteniendo imagen id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Crear una imagen (ahora con archivos)
  createImagenPropiedad(data: CreateImagenPropiedadRequest): Observable<ImagenPropiedad> {
    const formData = new FormData();
    formData.append('propiedad_id', data.propiedad_id.toString());

    data.imagenes.forEach(file => {
      formData.append('imagen', file); // el nombre 'imagen' coincide con upload.array("imagen")
    });

    return this.http.post<ImagenPropiedad>(this.apiUrl, formData, {
      headers: this.getAuthHeaders() // No agregues 'Content-Type': el navegador lo hará
    }).pipe(
      catchError(err => {
        console.error('Error creando imagen:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Actualizar una imagen (con soporte para archivo o URL)
  updateImagenPropiedad(id: number, data: UpdateImagenPropiedadRequest): Observable<ImagenPropiedad> {
    const formData = new FormData();
    
    // Agregar propiedad_id si se proporciona
    if (data.propiedad_id) {
      formData.append('propiedad_id', data.propiedad_id.toString());
    }
    
    // Si se proporciona un archivo, agregarlo
    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }
    
    // Si se proporciona URL (y no hay archivo), agregarla
    if (data.url && !data.imagen) {
      formData.append('url', data.url);
    }

    return this.http.put<ImagenPropiedad>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(err => {
        console.error(`Error actualizando imagen id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Eliminar una imagen (ahora elimina también de Cloudinary)
  deleteImagenPropiedad(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error eliminando imagen id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }
}