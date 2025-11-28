// Environment configuration for production
// This file will be replaced during build with actual values from environment variables
export const environment = {
  production: true,
  apiUrl: (window as any).__ENV__?.API_URL || 'https://api.tudominio.com'
};

