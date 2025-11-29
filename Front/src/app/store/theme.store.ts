import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeStore {
  // Estado privado con signal
  private _theme = signal<Theme>(this.getInitialTheme());

  // Estado público de solo lectura
  readonly theme = this._theme.asReadonly();
  
  // Computed values
  readonly isDark = computed(() => this._theme() === 'dark');
  readonly isLight = computed(() => this._theme() === 'light');

  constructor() {
    // Efecto para persistir y aplicar el tema
    effect(() => {
      const currentTheme = this._theme();
      this.applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // Acciones
  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  toggleTheme(): void {
    this._theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setLightTheme(): void {
    this._theme.set('light');
  }

  setDarkTheme(): void {
    this._theme.set('dark');
  }

  // Helpers privados
  private getInitialTheme(): Theme {
    // 1. Verificar localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // 2. Verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 3. Por defecto: light
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    const html = document.documentElement;
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      html.setAttribute('data-theme', 'dark');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      html.setAttribute('data-theme', 'light');
    }
  }
}

