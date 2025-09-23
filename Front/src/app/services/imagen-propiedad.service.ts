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
  url: string;
}

export interface UpdateImagenPropiedadRequest {
  propiedad_id?: number;
  url?: string;
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

  // ✅ Crear una imagen
  createImagenPropiedad(data: CreateImagenPropiedadRequest): Observable<ImagenPropiedad> {
    return this.http.post<ImagenPropiedad>(this.apiUrl, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error creando imagen:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Actualizar una imagen
  updateImagenPropiedad(id: number, data: UpdateImagenPropiedadRequest): Observable<ImagenPropiedad> {
    return this.http.put<ImagenPropiedad>(`${this.apiUrl}/${id}`, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error actualizando imagen id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Eliminar una imagen
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