// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificar si está logueado
  if (!auth.isLoggedIn()) {
    router.navigate(['/landing']);
    return false;
  }

  // 🔐 Validar permiso requerido desde data
  const modulo = route.data?.['modulo'];
  const operacion = route.data?.['operacion'];

  // Si no hay módulo/operación especificados, permitir acceso (solo verifica login)
  if (!modulo || !operacion) {
    return true;
  }

  // Verificar permiso
  const tienePermiso = auth.hasPermission(modulo, operacion);
  
  if (!tienePermiso) {
    // Evitar loop infinito: solo redirigir si no estamos ya en dashboard
    if (!state.url.includes('/dashboard')) {
      router.navigate(['/dashboard'], { skipLocationChange: false });
    }
    return false;
  }

  return true;
};
