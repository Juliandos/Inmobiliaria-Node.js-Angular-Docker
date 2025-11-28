// Environment configuration for development
// Para desarrollo local conectándose a AWS, usa la URL del ALB
// Para desarrollo con API local, cambia a: 'http://localhost:3001'
export const environment = {
  production: false,
  apiUrl: 'http://inmobiliaria-alb-556370462.us-east-1.elb.amazonaws.com/api'
  // apiUrl: 'http://localhost:3001'  // Descomenta esta línea si quieres usar API local
};

