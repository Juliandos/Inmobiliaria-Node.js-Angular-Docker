import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Propiedad {
  id: number;
  titulo: string;
  descripcion?: string;
  precio?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  tipo_id?: number;
  usuario_id?: number;
  tipo?: { id: number; nombre: string };
  usuario?: { id: number; nombre: string; apellido: string };
  imagenes_propiedads?: { id: number; url: string }[];
}

export interface CreatePropiedadRequest {
  titulo: string;
  descripcion?: string;
  precio?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  tipo_id?: number;
  usuario_id?: number;
}

export interface UpdatePropiedadRequest {
  titulo?: string;
  descripcion?: string;
  precio?: number;
  habitaciones?: number;
  banos?: number;
  parqueadero?: number;
  tipo_id?: number;
  usuario_id?: number;
}

@Injectable({ providedIn: 'root' })
export class PropiedadesService {
  private apiUrl = 'http://localhost:3001/propiedades';
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  getPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.apiUrl, { headers: this.getAuthHeaders() });
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