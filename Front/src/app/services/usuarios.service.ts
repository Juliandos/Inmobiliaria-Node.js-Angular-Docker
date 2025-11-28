import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  password?: string;
  rol_id: number;
  rol?: {
    id: number;
    nombre: string;
  };
}

export interface CreateUsuarioRequest {
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  rol_id: number;
}

export interface UpdateUsuarioRequest {
  email?: string;
  nombre?: string;
  apellido?: string;
  password?: string;
  rol_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = API_CONFIG.endpoints.usuarios;

  constructor(private http: HttpClient) {}

  // Función para crear headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // ✅ Obtener un usuario por ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Crear un usuario
  createUsuario(data: CreateUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Actualizar un usuario
  updateUsuario(id: number, data: UpdateUsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Eliminar un usuario
  deleteUsuario(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}