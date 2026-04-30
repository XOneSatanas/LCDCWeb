# Roadmap: Mejoras Futuras y Optimización - LCDC Web

Este documento detalla las estrategias de optimización y crecimiento técnico para **La Casa de las Cortinas**, diseñadas para maximizar el tráfico orgánico, la conversión de leads y el rendimiento del sitio.

## 1. Estrategia de Contenidos (Basada en AlsoAsked)

### Próximas Preguntas a Implementar:
- **Rama Materiales:** "¿Qué tela de cortina no se arruga?" y "¿Cuáles son las telas más resistentes?".
- **Rama Diseño:** "¿Qué hace que unas cortinas parezcan de alta gama?" y "¿Cómo lograr que una ventana luzca impecable sin cortinas?".
- **Rama Comparativas:** "¿Qué es mejor, roller o persiana?" (Crear una tabla comparativa visual).

### Acciones:
- [ ] Crear una página dedicada `/guia-de-estilo.html`.
- [ ] Implementar un selector de telas interactivo que explique los beneficios de cada una.

---

## 2. Optimización Técnica y SEO (SRE/SEO)

### Performance (WPO):
- [ ] **Compresión de Imágenes:** Convertir todos los activos de `.png` y `.jpg` a formato `.webp` para reducir el tiempo de carga en móviles.
- [ ] **Lazy Loading:** Asegurar que las imágenes del catálogo se carguen solo cuando el usuario haga scroll hasta ellas.

### SEO On-Page:
- [ ] **Estructura de Encabezados:** Revisar que cada página tenga una jerarquía de `H1`, `H2`, `H3` coherente.
- [ ] **Internal Linking:** Crear enlaces entre las respuestas del FAQ y las secciones de productos (ej: de la respuesta de Blackout al modal de Roller).

---

## 3. Conversión y CRM (Growth)

### Integración con Brevo:
- [ ] **Lead Scoring:** Configurar el agente de Brevo para que asigne mayor puntaje a los usuarios que interactúan con el FAQ técnico.
- [ ] **Automated Newsletter:** Crear una secuencia de correos para usuarios interesados en "Automatización" o "Profesionales".

### UX/UI:
- [ ] **Modales de Producto:** Agregar galerías de fotos reales a los modales (actualmente tienen mucho texto).
- [ ] **Botón de Acción Flotante (CTAs):** Implementar un botón de "Pedir Presupuesto" que siga al usuario durante el scroll.

---

## 4. Medición y Análisis

- [ ] **Google Analytics 4 (GA4):** Configurar eventos específicos para rastrear qué preguntas del FAQ son las más clicadas.
- [ ] **Meta Pixel:** Asegurar que el evento `Contact` se dispare correctamente al abrir WhatsApp desde el FAQ.

---

*Documento generado por Antigravity para La Casa de las Cortinas.*
