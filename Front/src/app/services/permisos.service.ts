import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Permiso {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl = 'http://localhost:3001/permisos';

  constructor(private http: HttpClient) {}

  // Función para crear headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ✅ Obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // ✅ Obtener un permiso por ID
  getPermiso(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // ✅ Crear un permiso
  createPermiso(data: Partial<Permiso>): Observable<Permiso> {
    return this.http.post<Permiso>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Actualizar un permiso
  updatePermiso(id: number, data: Partial<Permiso>): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // ✅ Eliminar un permiso
  deletePermiso(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
