// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ Guard ejecutándose para ruta:', state.url);

  // Verificar si está logueado
  if (!auth.isLoggedIn()) {
    console.log('❌ Usuario no logueado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  // 🔐 Validar permiso requerido desde data
  const modulo = route.data?.['modulo'];
  const operacion = route.data?.['operacion'];

  // Si no hay módulo/operación especificados, permitir acceso (solo verifica login)
  if (!modulo || !operacion) {
    console.log('✅ Ruta sin restricción de permisos, permitiendo acceso');
    return true;
  }

  // Verificar permiso
  const tienePermiso = auth.hasPermission(modulo, operacion);
  
  if (!tienePermiso) {
    console.log(`❌ Sin permiso ${operacion} para módulo ${modulo}, redirigiendo a dashboard`);
    // Evitar loop infinito: solo redirigir si no estamos ya en dashboard
    if (!state.url.includes('/dashboard')) {
      router.navigate(['/dashboard'], { skipLocationChange: false });
    }
    return false;
  }

  console.log(`✅ Permiso ${operacion} para ${modulo} verificado, permitiendo acceso`);
  return true;
};
