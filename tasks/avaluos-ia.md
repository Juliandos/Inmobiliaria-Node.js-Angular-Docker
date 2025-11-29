# Plan: Crear vista Avalúos IA

## Objetivo
Crear una nueva página "Avalúos IA" en el landing con:
- Formulario similar al de crear propiedad (sin funcionalidad de guardado)
- Espacio para mostrar el resultado de IA (texto generado)
- Mantener estilos artísticos del landing

## Tareas

- [x] 1. Crear carpeta y archivos del componente `avaluos-ia`
- [x] 2. Crear `avaluos-ia.component.ts` con el formulario
- [x] 3. Crear `avaluos-ia.component.html` con diseño dividido (formulario arriba, resultado abajo)
- [x] 4. Crear `avaluos-ia.component.scss` con estilos artísticos del landing
- [x] 5. Agregar ruta en `routes.ts`
- [x] 6. Agregar enlace en el header (menuItems)
- [x] 7. Excluir carousel de la ruta avaluos-ia en landing-layout

## Estructura del componente
```
avaluos-ia/
├── avaluos-ia.component.ts
├── avaluos-ia.component.html
└── avaluos-ia.component.scss
```

## Diseño
- Header con gradiente rojo (como nosotros/contacto)
- Formulario de propiedad (campos: título, precio, área, descripción, habitaciones, baños, parqueadero, ciudad, tipo)
- Botón "Generar Avalúo"
- Sección de resultado con placeholder para texto de IA

---

## ✅ Revisión - Completado

### Archivos creados:
- `Front/src/app/views/landing/avaluos-ia/avaluos-ia.component.ts`
- `Front/src/app/views/landing/avaluos-ia/avaluos-ia.component.html`
- `Front/src/app/views/landing/avaluos-ia/avaluos-ia.component.scss`

### Archivos modificados:
- `Front/src/app/views/landing/routes.ts` - Agregada ruta `/avaluos-ia`
- `Front/src/app/components/shared/header/header.component.ts` - Agregado enlace "Avalúos IA" en menuItems
- `Front/src/app/views/landing/layout/landing-layout.component.ts` - Excluido carousel de la ruta

### Características implementadas:
1. **Header** con gradiente rojo, icono de IA y animaciones
2. **Formulario completo** con campos:
   - Título, Ciudad, Barrio, Tipo de propiedad
   - Estrato, Área, Antigüedad
   - Habitaciones, Baños, Parqueaderos
   - Precio estimado, Descripción
3. **Sección de resultado** con:
   - Placeholder animado cuando no hay resultado
   - Estado de carga con spinner
   - Área de texto para mostrar el avalúo generado
4. **Simulación de IA** (placeholder) que genera un resultado de ejemplo
5. **Estilos artísticos** consistentes con el landing
6. **Responsive design** para móviles
7. **Soporte para temas** claro/oscuro

### URL de acceso:
- `http://localhost:4200/#/landing/avaluos-ia`

