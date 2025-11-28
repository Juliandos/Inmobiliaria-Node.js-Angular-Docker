import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Modulo {
  id: number;
  nombre: string;
  createdAt?: string;
  updatedAt?: string;
  permisos?: any[]; // Para cuando se incluyen los permisos
}

export interface CreateModuloRequest {
  nombre: string;
}

export interface UpdateModuloRequest {
  nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  private apiUrl = API_CONFIG.endpoints.modulos;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todos los módulos
  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error obteniendo módulos:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Obtener un módulo por ID
  getModulo(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error obteniendo módulo id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Crear un módulo
  createModulo(data: CreateModuloRequest): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error('Error creando módulo:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Actualizar un módulo
  updateModulo(id: number, data: UpdateModuloRequest): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${id}`, data, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error actualizando módulo id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Eliminar un módulo
  deleteModulo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(err => {
        console.error(`Error eliminando módulo id=${id}:`, err);
        return throwError(() => err);
      })
    );
  }
}