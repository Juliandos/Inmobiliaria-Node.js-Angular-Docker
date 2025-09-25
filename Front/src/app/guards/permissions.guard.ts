// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 🔐 Opcional: validar permiso requerido desde data
  const modulo = route.data?.['modulo'];
  const operacion = route.data?.['operacion'];

  if (modulo && operacion && !auth.hasPermission(modulo, operacion)) {
    router.navigate(['/dashboard']); // o página de error
    return false;
  }

  return true;
};
