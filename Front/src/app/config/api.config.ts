import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    auth: `${environment.apiUrl}/auth`,
    propiedades: `${environment.apiUrl}/propiedades`,
    usuarios: `${environment.apiUrl}/usuarios`,
    roles: `${environment.apiUrl}/roles`,
    permisos: `${environment.apiUrl}/permisos`,
    modulos: `${environment.apiUrl}/modulos`,
    tipos: `${environment.apiUrl}/tipo-propiedad`,
    operaciones: `${environment.apiUrl}/operacion`,
    imagenes: `${environment.apiUrl}/imagen-propiedad`
  }
};

