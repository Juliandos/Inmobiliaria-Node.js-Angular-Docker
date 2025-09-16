import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // ✅ Obtener todos los permisos
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.apiUrl);
  }

  // ✅ Obtener un permiso por ID
  getPermiso(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/${id}`);
  }

  // ✅ Crear un permiso
  createPermiso(data: Partial<Permiso>): Observable<Permiso> {
    return this.http.post<Permiso>(this.apiUrl, data);
  }

  // ✅ Actualizar un permiso
  updatePermiso(id: number, data: Partial<Permiso>): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Eliminar un permiso
  deletePermiso(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
