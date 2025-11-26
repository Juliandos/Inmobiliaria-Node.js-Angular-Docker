import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Operacion {
  id: number;
  nombre: string;
  propiedades?: any[];
}

export interface CreateOperacionRequest {
  nombre: string;
}

export interface UpdateOperacionRequest {
  nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OperacionesService {
  private apiUrl = 'http://localhost:3001/operacion';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /** Obtener todas las operaciones con sus propiedades */
  getOperaciones(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error obteniendo operaciones', err);
        return throwError(() => err);
      })
    );
  }

  /** Obtener una operación por ID */
  getOperacion(id: number): Observable<Operacion> {
    return this.http.get<Operacion>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error obteniendo operación id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Crear una nueva operación */
  createOperacion(data: CreateOperacionRequest): Observable<Operacion> {
    return this.http.post<Operacion>(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error creando operación', err);
        return throwError(() => err);
      })
    );
  }

  /** Actualizar una operación existente */
  updateOperacion(id: number, data: UpdateOperacionRequest): Observable<Operacion> {
    return this.http.put<Operacion>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error actualizando operación id=${id}`, err);
        return throwError(() => err);
      })
    );
  }

  /** Eliminar una operación por ID */
  deleteOperacion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error(`Error eliminando operación id=${id}`, err);
        return throwError(() => err);
      })
    );
  }
}

