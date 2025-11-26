# 📁 Estructura de Carpetas en Angular 18 - Guía Completa

## 🎯 Conceptos Clave: Componentes vs Vistas

En Angular, a diferencia de React, la terminología es más específica:

### **Vistas (Views) / Páginas**
- Son componentes que representan **páginas completas** o **rutas**
- Equivalente a "Pages" en React Router o Next.js
- Ejemplos: `home`, `nosotros`, `contacto`, `propiedades`, `dashboard`
- Se organizan en `views/` o `pages/`

### **Componentes Reutilizables**
- Son componentes que se **reutilizan** en múltiples vistas
- Equivalente a "Components" en React
- Ejemplos: `header`, `footer`, `property-card`, `search-filter`, `carousel`
- Deberían estar en `components/` o `shared/components/`

---

## 📂 Estructura Recomendada para Angular 18

```
src/app/
├── components/              # 🎨 Componentes reutilizables (shared)
│   ├── shared/              # Componentes compartidos globalmente
│   │   ├── header/
│   │   ├── footer/
│   │   ├── property-card/
│   │   ├── search-filter/
│   │   └── carousel/
│   └── landing/             # Componentes específicos de landing
│       ├── hero-carousel/
│       ├── minimal-carousel/
│       └── property-images-carousel/
│
├── views/                   # 📄 Vistas/Páginas (rutas)
│   ├── landing/             # Módulo de landing page
│   │   ├── home/            # Vista: Página de inicio
│   │   ├── nosotros/        # Vista: Página Nosotros
│   │   ├── contacto/        # Vista: Página Contacto
│   │   ├── propiedades-publicas/  # Vista: Listado de propiedades
│   │   ├── property-detail/ # Vista: Detalle de propiedad
│   │   ├── operacion-propiedades/  # Vista: Propiedades por operación
│   │   ├── layout/          # Layout específico de landing
│   │   └── routes.ts        # Rutas del módulo landing
│   │
│   ├── dashboard/           # Módulo de dashboard
│   │   ├── dashboard.component.ts
│   │   └── routes.ts
│   │
│   ├── profile/            # Módulo de perfil/admin
│   │   ├── usuarios/
│   │   ├── propiedades/
│   │   ├── operaciones/
│   │   └── routes.ts
│   │
│   └── pages/              # Páginas especiales
│       ├── login/
│       ├── register/
│       ├── page404/
│       └── routes.ts
│
├── layout/                  # 🏗️ Layouts principales
│   └── default-layout/     # Layout del dashboard
│
├── services/                # 🔧 Servicios (lógica de negocio)
│   ├── auth.service.ts
│   ├── propiedades.service.ts
│   └── operaciones.service.ts
│
├── guards/                  # 🛡️ Guards (protección de rutas)
│   └── permissions.guard.ts
│
├── directives/             # 📝 Directivas personalizadas
│   └── has-permission.directive.ts
│
└── app.routes.ts           # 🗺️ Rutas principales
```

---

## 🔄 Comparación: React vs Angular

### **React (lo que conoces)**
```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── PropertyCard.jsx
├── pages/              # Páginas/Vistas
│   ├── Home.jsx
│   ├── About.jsx
│   └── Contact.jsx
└── App.jsx
```

### **Angular (equivalente)**
```
src/app/
├── components/          # Componentes reutilizables
│   ├── header/
│   ├── footer/
│   └── property-card/
├── views/              # Vistas/Páginas
│   ├── home/
│   ├── nosotros/
│   └── contacto/
└── app.routes.ts       # Configuración de rutas
```

---

## 🎨 Estructura Actual vs Recomendada

### ❌ **Estructura Actual (Mezclada)**
```
views/landing/
├── header/              # ⚠️ Componente reutilizable mezclado
├── footer/              # ⚠️ Componente reutilizable mezclado
├── property-card/       # ⚠️ Componente reutilizable mezclado
├── home/                # ✅ Vista correcta
├── nosotros/            # ✅ Vista correcta
└── contacto/            # ✅ Vista correcta
```

### ✅ **Estructura Recomendada**
```
components/
└── shared/
    ├── header/          # ✅ Componente reutilizable
    ├── footer/          # ✅ Componente reutilizable
    └── property-card/   # ✅ Componente reutilizable

views/landing/
├── home/                # ✅ Vista
├── nosotros/            # ✅ Vista
└── contacto/            # ✅ Vista
```

---

## 📋 Reglas de Organización

### **1. Componentes Reutilizables (`components/`)**
- ✅ Se usan en **múltiples vistas**
- ✅ No tienen lógica de ruta propia
- ✅ Son "dumb components" o "presentational components"
- ✅ Ejemplos: `PropertyCard`, `Header`, `Footer`, `SearchFilter`

### **2. Vistas (`views/`)**
- ✅ Representan una **ruta específica**
- ✅ Pueden usar múltiples componentes reutilizables
- ✅ Contienen la lógica de la página
- ✅ Ejemplos: `Home`, `Nosotros`, `PropertyDetail`, `Dashboard`

### **3. Layouts (`layout/`)**
- ✅ Estructura general de la aplicación
- ✅ Contiene headers, sidebars, footers globales
- ✅ Ejemplos: `DefaultLayout`, `LandingLayout`

---

## 🚀 Cómo Reorganizar tu Proyecto

### **Paso 1: Crear estructura de componentes**
```bash
# Crear carpetas para componentes reutilizables
mkdir -p Front/src/app/components/shared
mkdir -p Front/src/app/components/landing
```

### **Paso 2: Mover componentes reutilizables**
```bash
# Mover componentes compartidos
mv Front/src/app/views/landing/header Front/src/app/components/shared/
mv Front/src/app/views/landing/footer Front/src/app/components/shared/
mv Front/src/app/views/landing/property-card Front/src/app/components/shared/
mv Front/src/app/views/landing/search-filter Front/src/app/components/shared/

# Mover componentes específicos de landing
mv Front/src/app/views/landing/hero-carousel Front/src/app/components/landing/
mv Front/src/app/views/landing/minimal-carousel Front/src/app/components/landing/
mv Front/src/app/views/landing/property-images-carousel Front/src/app/components/landing/
mv Front/src/app/views/landing/google-maps Front/src/app/components/landing/
```

### **Paso 3: Actualizar imports**
Después de mover, actualizar los imports en los archivos que los usan:

```typescript
// ❌ Antes
import { LandingHeaderComponent } from '../header/header.component';

// ✅ Después
import { LandingHeaderComponent } from '../../../components/shared/header/header.component';
```

---

## 📝 Convenciones de Nomenclatura

### **Componentes**
- ✅ `PropertyCardComponent` (PascalCase)
- ✅ `landing-header.component.ts` (kebab-case para archivos)
- ✅ Selector: `app-property-card` (kebab-case)

### **Vistas**
- ✅ `HomeComponent`, `NosotrosComponent`
- ✅ `home.component.ts`
- ✅ Selector: `app-home`

### **Servicios**
- ✅ `PropiedadesService`, `OperacionesService`
- ✅ `propiedades.service.ts`

---

## 🎯 Beneficios de esta Estructura

1. **Separación clara**: Componentes vs Vistas
2. **Reutilización**: Componentes fáciles de encontrar y usar
3. **Mantenibilidad**: Código organizado y predecible
4. **Escalabilidad**: Fácil agregar nuevos módulos
5. **Convenciones**: Sigue estándares de Angular

---

## 📚 Recursos Adicionales

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Folder Structure Best Practices](https://angular.io/guide/file-structure)

