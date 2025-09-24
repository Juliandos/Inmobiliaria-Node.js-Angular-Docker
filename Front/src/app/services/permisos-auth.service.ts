// Front/src/app/services/permisos-auth.service.ts
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
    c: boolean; // Create
    r: boolean; // Read
    u: boolean; // Update
    d: boolean; // Delete
  }[];
}

export interface PermissionCheck {
  modulo: string;
  operacion: 'c' | 'r' | 'u' | 'd';
}

@Injectable({
  providedIn: 'root'
})
export class PermisosAuthService {
  private apiUrl = 'http://localhost:3001/auth';
  private userPermissions$ = new BehaviorSubject<UserPermissions | null>(null);
  private permissionsLoaded = false;

  constructor(private http: HttpClient) {
    // Cargar permisos al inicializar si hay token
    if (this.hasToken()) {
      this.loadUserPermissions();
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
      return of(null);
    }

    return this.http.get<UserPermissions>(`${this.apiUrl}/me/permisos`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(permissions => {
        this.userPermissions$.next(permissions);
        this.permissionsLoaded = true;
        console.log('Permisos cargados:', permissions);
      }),
      catchError(err => {
        console.error('Error cargando permisos:', err);
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
        if (!permissions) return false;

        const moduloPermiso = permissions.permisos.find(p => 
          p.modulo.toLowerCase() === modulo.toLowerCase()
        );

        if (!moduloPermiso) return false;

        return moduloPermiso[operacion];
      })
    );
  }

  /**
   * Verifica múltiples permisos a la vez
   */
  hasPermissions(checks: PermissionCheck[]): Observable<boolean[]> {
    return this.getUserPermissions().pipe(
      map(permissions => {
        if (!permissions) return checks.map(() => false);

        return checks.map(check => {
          const moduloPermiso = permissions.permisos.find(p => 
            p.modulo.toLowerCase() === check.modulo.toLowerCase()
          );
          return moduloPermiso ? moduloPermiso[check.operacion] : false;
        });
      })
    );
  }

  /**
   * Verifica si el usuario tiene algún permiso en un módulo
   */
  hasAnyPermissionInModule(modulo: string): Observable<boolean> {
    return this.getUserPermissions().pipe(
      map(permissions => {
        if (!permissions) return false;

        const moduloPermiso = permissions.permisos.find(p => 
          p.modulo.toLowerCase() === modulo.toLowerCase()
        );

        if (!moduloPermiso) return false;

        return moduloPermiso.c || moduloPermiso.r || moduloPermiso.u || moduloPermiso.d;
      })
    );
  }

  /**
   * Obtiene la información del rol del usuario
   */
  getUserRole(): Observable<{ id: number; nombre: string } | null> {
    return this.getUserPermissions().pipe(
      map(permissions => permissions ? permissions.rol : null)
    );
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(
      map(role => role ? role.nombre.toLowerCase() === 'administrador' : false)
    );
  }

  /**
   * Limpia los permisos del usuario (para logout)
   */
  clearPermissions(): void {
    this.userPermissions$.next(null);
    this.permissionsLoaded = false;
  }

  /**
   * Obtiene todos los módulos a los que el usuario tiene acceso
   */
  getAccessibleModules(): Observable<string[]> {
    return this.getUserPermissions().pipe(
      map(permissions => {
        if (!permissions) return [];
        return permissions.permisos
          .filter(p => p.r) // Al menos debe tener permiso de lectura
          .map(p => p.modulo);
      })
    );
  }

  /**
   * Verifica permisos de forma síncrona (usar solo cuando se esté seguro de que los permisos están cargados)
   */
  hasPermissionSync(modulo: string, operacion: 'c' | 'r' | 'u' | 'd'): boolean {
    const permissions = this.userPermissions$.value;
    if (!permissions) return false;

    const moduloPermiso = permissions.permisos.find(p => 
      p.modulo.toLowerCase() === modulo.toLowerCase()
    );

    return moduloPermiso ? moduloPermiso[operacion] : false;
  }
}