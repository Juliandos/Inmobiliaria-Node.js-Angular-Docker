// Front/src/app/services/permisos-auth.service.ts (CORREGIDO)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface UserPermissions {
  userId: number;
  email: string;
  rol: {
    id: number;
    nombre: string;
  };
  permisos: {
    modulo: string;
    c: boolean;
    r: boolean;
    u: boolean;
    d: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PermisosAuthService {
  private apiUrl = 'http://localhost:3001';
  private userPermissions$ = new BehaviorSubject<UserPermissions | null>(null);
  private permissionsLoaded = false;

  constructor(private http: HttpClient) {
    if (this.hasToken()) {
      this.loadUserPermissions().subscribe();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Carga los permisos del usuario desde el backend
   */
  loadUserPermissions(): Observable<UserPermissions | null> {
    if (!this.hasToken()) {
      this.userPermissions$.next(null);
      this.permissionsLoaded = true;
      return of(null);
    }

    return this.http.get<UserPermissions>(`${this.apiUrl}/permisos`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(permissions => {
        console.log('✅ Permisos cargados del backend:', permissions);
        this.userPermissions$.next(permissions);
        this.permissionsLoaded = true;
      }),
      catchError(err => {
        console.error('❌ Error cargando permisos:', err);
        // Si hay error 401, el token puede haber expirado
        if (err.status === 401) {
          console.warn('Token expirado, limpiando sesión');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        this.userPermissions$.next(null);
        this.permissionsLoaded = true;
        return of(null);
      })
    );
  }

  /**
   * Obtiene los permisos actuales del usuario
   */
  getUserPermissions(): Observable<UserPermissions | null> {
    if (!this.permissionsLoaded && this.hasToken()) {
      return this.loadUserPermissions();
    }
    return this.userPermissions$.asObservable();
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(modulo: string, operacion: 'c' | 'r' | 'u' | 'd'): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => {
        // console.log("Verificando permisos para:", modulo, operacion);
        console.log("permissions: ", permissions);
        
        if (!permissions || !permissions.permisos) {
          console.log("No hay permisos cargados");
          return false;
        }
        
        const moduloPermiso = permissions.permisos.find(p => 
          p.modulo.toLowerCase() === modulo.toLowerCase()
        );

        console.log("Permiso encontrado para módulo:", moduloPermiso);

        if (!moduloPermiso) {
          console.log("No se encontró permiso para el módulo:", modulo);
          return false;
        }

        const tienePermiso = moduloPermiso[operacion];
        console.log("¿Tiene permiso?", tienePermiso);
        
        return tienePermiso;
      }),
      catchError(err => {
        console.error('Error verificando permiso:', err);
        return of(false);
      })
    );
  }

  // ... resto de métodos igual ...
}