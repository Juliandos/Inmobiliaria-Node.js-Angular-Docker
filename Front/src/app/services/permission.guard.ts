import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PermisosAuthService } from './permisos-auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  private authService = inject(AuthService);
  private permisosAuthService = inject(PermisosAuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Primero verificar si está logueado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    // Obtener los datos de permisos requeridos de la configuración de la ruta
    const requiredModule = route.data?.['module'] as string;
    const requiredPermission = route.data?.['permission'] as 'c' | 'r' | 'u' | 'd';

    // Si no se especifican permisos en la ruta, solo verificar autenticación
    if (!requiredModule || !requiredPermission) {
      return of(true);
    }

    // Verificar permisos específicos
    return this.permisosAuthService.hasPermission(requiredModule, requiredPermission).pipe(
      map(hasPermission => {
        if (!hasPermission) {
          // Redirigir a página de acceso denegado o dashboard
          this.router.navigate(['/dashboard'], {
            queryParams: { 
              message: `No tienes permisos para acceder a ${requiredModule}` 
            }
          });
          return false;
        }
        return true;
      }),
      catchError(err => {
        console.error('Error verificando permisos:', err);
        this.router.navigate(['/dashboard']);
        return of(false);
      })
    );
  }
}