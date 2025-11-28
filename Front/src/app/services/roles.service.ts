import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Rol {
  id: number;
  nombre: string;
  usuarios?: any[];
}

export interface CreateRolRequest {
  nombre: string;
}

export interface UpdateRolRequest {
  nombre?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = API_CONFIG.endpoints.roles;

  constructor(private http: HttpClient) {}

  // Función para crear headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // ✅ Obtener un rol por ID
  getRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Crear un rol
  createRol(data: CreateRolRequest): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Actualizar un rol
  updateRol(id: number, data: UpdateRolRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Eliminar un rol
  deleteRol(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}