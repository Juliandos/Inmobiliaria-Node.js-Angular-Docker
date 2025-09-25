import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/auth';
  private permisos: any[] = []; // permisos en memoria

  constructor(private http: HttpClient, private router: Router) {}

  /** 🔑 Generar headers con Bearer Token */
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
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.user.email);
        localStorage.setItem('userId', res.user.id);

        // 👇 cargar permisos después del login
        this.loadUserPermissions(res.user.id).subscribe();
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

        this.loadUserPermissions(res.user.id).subscribe();
      })
    );
  }

  /** 📌 CARGAR PERMISOS DEL USUARIO */
  loadUserPermissions(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3001/permisos/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((permisos) => {
        this.permisos = permisos;
        console.log('Permisos cargados:', permisos);
        localStorage.setItem('permisos', JSON.stringify(permisos));
      })
    );
  }

  /** 📌 OBTENER PERMISOS DESDE LOCALSTORAGE (fallback) */
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
    const permiso = permisos.find(p => p.modulo?.nombre?.toLowerCase() === modulo.toLowerCase());
    return permiso ? permiso[operacion] === true : false;
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

  /** LOGOUT */
  logoutBackend(userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout/${userId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.clearSession())
    );
  }

  logoutLocal(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('permisos');
    this.permisos = [];
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
