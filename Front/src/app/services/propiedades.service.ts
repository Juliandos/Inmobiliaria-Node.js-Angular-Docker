import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Propiedad {
  id: number;
  titulo: string;
  descripcion?: string;
  precio?: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  ciudad?: string;
  tipo_id?: number;
  usuario_id?: number;
  operacion_id?: number;
  tipo?: { id: number; nombre: string };
  usuario?: { id: number; nombre: string; apellido: string };
  operacion?: { id: number; nombre: string };
  imagenes_propiedads?: { id: number; url: string }[];
}

export interface CreatePropiedadRequest {
  titulo: string;
  descripcion?: string;
  precio?: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  ciudad?: string;
  tipo_id?: number;
  usuario_id?: number;
  operacion_id?: number;
}

export interface UpdatePropiedadRequest {
  titulo?: string;
  descripcion?: string;
  precio?: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  ciudad?: string;
  tipo_id?: number;
  usuario_id?: number;
  operacion_id?: number;
}

@Injectable({ providedIn: 'root' })
export class PropiedadesService {
  private apiUrl = API_CONFIG.endpoints.propiedades;
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  getPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Obtener propiedades públicas (sin autenticación, para landing page)
  getPropiedadesPublicas(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.apiUrl);
  }

  // Obtener propiedades por operación con límite (para landing page)
  // No requiere autenticación ya que es público
  getPropiedadesByOperacion(operacionId: number, limit: number = 10): Observable<Propiedad[]> {
    let params = new HttpParams();
    params = params.set('operacion_id', operacionId.toString());
    params = params.set('limit', limit.toString());
    
    return this.http.get<Propiedad[]>(this.apiUrl, { params });
  }

  getPropiedad(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPropiedad(data: CreatePropiedadRequest): Observable<Propiedad> {
    return this.http.post<Propiedad>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  updatePropiedad(id: number, data: UpdatePropiedadRequest): Observable<Propiedad> {
    return this.http.put<Propiedad>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deletePropiedad(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}