import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface TipoPropiedad {
  id: number;
  nombre: string;
  propiedades?: any[]; // puedes tipar las propiedades si ya tienes la interfaz
}

@Injectable({
  providedIn: 'root'
})
export class TiposPropiedadService {
  private apiUrl = 'http://localhost:3001/tipos-propiedad'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  /** Obtener todos los tipos con sus propiedades */
  getTipos(): Observable<TipoPropiedad[]> {
    return this.http.get<TipoPropiedad[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error obteniendo tipos de propiedad', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtener un tipo de propiedad por ID */
  getTipo(id: number): Observable<TipoPropiedad> {
    return this.http.get<TipoPropiedad>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Error obteniendo tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Crear un nuevo tipo de propiedad */
  createTipo(data: Partial<TipoPropiedad>): Observable<TipoPropiedad> {
    return this.http.post<TipoPropiedad>(this.apiUrl, data).pipe(
      catchError(err => {
        console.error('Error creando tipo de propiedad', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualizar un tipo de propiedad existente */
  updateTipo(id: number, data: Partial<TipoPropiedad>): Observable<TipoPropiedad> {
    return this.http.put<TipoPropiedad>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(err => {
        console.error(`Error actualizando tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Eliminar un tipo de propiedad por ID */
  deleteTipo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        console.error(`Error eliminando tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }
}
