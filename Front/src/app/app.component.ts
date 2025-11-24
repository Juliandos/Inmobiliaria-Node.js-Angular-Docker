import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'CoreUI Angular Admin Template';
  private authService = inject(AuthService);

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    // Cargar permisos si el usuario está logueado
    if (this.authService.isLoggedIn()) {
      const rolId = localStorage.getItem('rolId');
      if (rolId) {
        console.log('🔄 Cargando permisos al iniciar app para rol:', rolId);
        this.authService.loadPermissionsByRole(Number(rolId)).subscribe({
          next: (permisos) => {
            console.log('✅ Permisos cargados:', permisos.length);
          },
          error: (err) => {
            console.error('❌ Error cargando permisos:', err);
          }
        });
      }
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
