import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/auth';

  constructor(private http: HttpClient, private router: Router) {}

  /** LOGIN */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        console.log('✅ Respuesta del login:', res);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.user.email);
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
        console.log('✅ Usuario registrado:', res);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.user.email);
      })
    );
  }

  /** REFRESH TOKEN */
  refresh(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((res) => {
        console.log('🔄 Token refrescado:', res);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  /** LOGOUT */
  logoutBackend(userId: number): Observable<any> {
    // Llama al backend para invalidar refreshToken
    return this.http.post<any>(`${this.apiUrl}/logout/${userId}`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  /** LOGOUT LOCAL: borra datos locales y redirige */
  logoutLocal(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** BORRA LOCALSTORAGE */
  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
  }

  /** VERIFICA LOGIN */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
