import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Permiso {
  id: number;
  nombre: string;
  c: boolean; // Create
  r: boolean; // Read
  u: boolean; // Update
  d: boolean; // Delete
  rol_id: number;
  modulo_id: number;
  createdAt?: string;
  updatedAt?: string;
  rol?: {
    id: number;
    nombre: string;
  };
  modulo?: {
    id: number;
    nombre: string;
  };
}

export interface CreatePermisoRequest {
  nombre: string;
  c?: boolean;
  r?: boolean;
  u?: boolean;
  d?: boolean;
  rol_id: number;
  modulo_id: number;
}

export interface UpdatePermisoRequest {
  nombre?: string;
  c?: boolean;
  r?: boolean;
  u?: boolean;
  d?: boolean;
  rol_id?: number;
  modulo_id?: number;
}

export interface Modulo {
  id: number;
  nombre: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl = 'http://localhost:3001/permisos';
  private modulosUrl = 'http://localhost:3001/modulos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error obteniendo permisos:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener un permiso por ID
  getPermiso(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error obteniendo permiso id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Crear un permiso
  createPermiso(data: CreatePermisoRequest): Observable<Permiso> {
    return this.http.post<Permiso>(this.apiUrl, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error creando permiso:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Actualizar un permiso
  updatePermiso(id: number, data: UpdatePermisoRequest): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/${id}`, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error actualizando permiso id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Eliminar un permiso
  deletePermiso(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error eliminando permiso id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener permisos por rol
  getPermisosByRol(rolId: number): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}/rol/${rolId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error obteniendo permisos para rol id=${rolId}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener permisos por módulo
  getPermisosByModulo(moduloId: number): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}/modulo/${moduloId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error obteniendo permisos para módulo id=${moduloId}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener todos los módulos (necesario para los dropdowns)
  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.modulosUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error obteniendo módulos:', err);
        return throwError(() => err);
      })
    );
  }
}