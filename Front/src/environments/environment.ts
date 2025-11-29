// Environment configuration for development
// Usando CloudFront con HTTPS para acceso desde móviles
// Para desarrollo con API local, cambia a: 'http://localhost:3001'
export const environment = {
  production: false,
  apiUrl: 'https://dd7fs4h07d7iz.cloudfront.net/api'
  // apiUrl: 'http://localhost:3001'  // Descomenta esta línea si quieres usar API local
};

