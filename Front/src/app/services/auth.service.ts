// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/auth';
  private permisos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  /** 🔑 Headers con Bearer Token */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  /** LOGIN */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        // guardar sesión básica
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('rolId', res.user.rol_id);
      }),
      switchMap((res) => {
        const rolId = res.user.rol_id;
        // 👇 cargar permisos por rol
        return this.loadPermissionsByRole(rolId).pipe(map(() => res));
      })
    );
  }

  /** REGISTER */
  register(nombre: string, apellido: string, email: string, password: string, rol_id?: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      nombre,
      email,
      apellido,
      password,
      rol_id,
    }).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('userId', res.user.id);
        localStorage.setItem('rolId', res.user.rol_id);

      }),
      switchMap((res) => {
        const rolId = res.user.rol_id;
        return this.loadPermissionsByRole(rolId).pipe(map(() => res));
      })
    );
  }

  /** 📌 CARGAR PERMISOS POR ROL */
  loadPermissionsByRole(rolId: number): Observable<any[]> {
    // 👉 Ajusta la URL a tu backend: GET /permisos/rol/:rolId
    return this.http.get<any[]>(`http://localhost:3001/permisos/rol/${rolId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((permisos) => {
        this.permisos = permisos;
        localStorage.setItem('permisos', JSON.stringify(permisos));
      })
    );
  }

  /** 📌 OBTENER PERMISOS (desde memoria o LS) */
  getPermissions(): any[] {
    if (!this.permisos.length) {
      const permisosLS = localStorage.getItem('permisos');
      this.permisos = permisosLS ? JSON.parse(permisosLS) : [];
    }
    return this.permisos;
  }

  /** 📌 VERIFICAR PERMISO */
  hasPermission(modulo: string, operacion: 'c' | 'r' | 'u' | 'd'): boolean {
    const permisos = this.getPermissions();
    console.log('🔍 Verificando permiso:', { modulo, operacion, totalPermisos: permisos.length });
    
    const permiso = permisos.find(p => {
      const moduloNombre = p.modulo?.nombre?.toLowerCase();
      const moduloBuscado = modulo.toLowerCase();
      return moduloNombre === moduloBuscado;
    });
    
    if (!permiso) {
      console.log('❌ Permiso no encontrado para módulo:', modulo);
      return false;
    }
    
    // El backend devuelve números (0/1) o booleanos, verificar ambos
    const tienePermiso = permiso[operacion] === true || permiso[operacion] === 1;
    console.log(`✅ Permiso ${operacion} para ${modulo}:`, tienePermiso, `(valor: ${permiso[operacion]})`);
    
    return tienePermiso;
  }

  /** REFRESH TOKEN */
  refresh(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  /** LOGOUT BACKEND */
  logoutBackend(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout/${userId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.clearSession())
    );
  }

  /** LOGOUT LOCAL */
  logoutLocal(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('rolId');
    localStorage.removeItem('permisos');
    this.permisos = [];
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /** 📌 OBTENER USUARIO (con permisos incluidos) */
  getUser(): any {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const rolId = localStorage.getItem('rolId');
    const permisos = this.getPermissions(); // usa tu método existente

    if (!userId || !email || !rolId) {
      return null;
    }

    return {
      id: Number(userId),
      email,
      rol_id: Number(rolId),
      permisos
    };
  }
}
