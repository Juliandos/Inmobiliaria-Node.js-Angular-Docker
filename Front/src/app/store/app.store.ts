import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  // Estados privados
  private _isAuthenticated = signal<boolean>(false);
  private _user = signal<User | null>(null);
  private _isLoading = signal<boolean>(false);

  // Estados públicos de solo lectura
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed values
  readonly userName = computed(() => this._user()?.nombre ?? 'Invitado');
  readonly userEmail = computed(() => this._user()?.email ?? '');
  readonly userRole = computed(() => this._user()?.rol ?? '');

  // Acciones de autenticación
  login(user: User): void {
    this._user.set(user);
    this._isAuthenticated.set(true);
  }

  logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
  }

  updateUser(userData: Partial<User>): void {
    this._user.update(current => current ? { ...current, ...userData } : null);
  }

  // Acciones de loading
  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  startLoading(): void {
    this._isLoading.set(true);
  }

  stopLoading(): void {
    this._isLoading.set(false);
  }

  // Resetear todo el estado
  reset(): void {
    this._isAuthenticated.set(false);
    this._user.set(null);
    this._isLoading.set(false);
  }
}

