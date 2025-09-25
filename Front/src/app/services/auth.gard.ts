import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PermisosAuthService } from '../services/permisos-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private permisosAuthService = inject(PermisosAuthService);
    private router = inject(Router);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }

        // Si hay token, cargar permisos del usuario si no están cargados
        this.permisosAuthService.getUserPermissions().subscribe({
            next: permissions => {
                if (!permissions) {
                    console.warn('No se pudieron cargar los permisos del usuario');
                }
            },
            error: err => {
                console.error('Error cargando permisos en AuthGuard:', err);
            }
        });
        
        return true;
    }
}
