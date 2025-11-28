import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface TipoPropiedad {
  id: number;
  nombre: string;
  propiedades?: any[];
}

export interface CreateTipoPropiedadRequest {
  nombre: string;
}

export interface UpdateTipoPropiedadRequest {
  nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TiposPropiedadService {
  private apiUrl = API_CONFIG.endpoints.tipos;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /** Obtener todos los tipos con sus propiedades */
  getTipos(): Observable<TipoPropiedad[]> {
    return this.http.get<TipoPropiedad[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error obteniendo tipos de propiedad', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtener un tipo de propiedad por ID */
  getTipo(id: number): Observable<TipoPropiedad> {
    return this.http.get<TipoPropiedad>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error obteniendo tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Crear un nuevo tipo de propiedad */
  createTipo(data: CreateTipoPropiedadRequest): Observable<TipoPropiedad> {
    return this.http.post<TipoPropiedad>(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error creando tipo de propiedad', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualizar un tipo de propiedad existente */
  updateTipo(id: number, data: UpdateTipoPropiedadRequest): Observable<TipoPropiedad> {
    return this.http.put<TipoPropiedad>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error actualizando tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Eliminar un tipo de propiedad por ID */
  deleteTipo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error eliminando tipo propiedad id=${id}`, err);
        return throwError(() => err);
      })
    );
  }
}