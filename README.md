# Next.js + Sanity Template

Template base para arrancar proyectos con **Next.js (App Router)** + **Sanity Studio** + **SCSS modules**.

## Stack

- Next.js 15 (App Router)
- React 19
- Sanity v3
- TypeScript
- SCSS + Tailwind base CSS

## Requisitos

- Node.js 20+
- npm 10+
- Cuenta/proyecto en Sanity

## Setup rápido

1. Instala dependencias:

```bash
npm install
```

2. Crea tu entorno local:

```bash
cp .env.example .env.local
```

3. Rellena variables mínimas en `.env.local`:

```env
NEXT_PUBLIC_CLIENT_ID=YOUR_CLIENT_ID
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-17
```

4. Arranca el proyecto:

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Studio: `http://localhost:3000/admin`

## Variables de entorno

### Requeridas

- `NEXT_PUBLIC_CLIENT_ID`: prefijo para cookies de consentimiento
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### Opcionales

- `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2023-05-17`)
- `MAILCHIMP_AUDIENCE_ID`
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_API_SERVER`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_FB_ID`
- `NEXT_PUBLIC_PINTEREST_ID`
- `NEXT_PUBLIC_HOTJAR_ID`

## Scripts

```bash
npm run dev      # Desarrollo
npm run lint     # ESLint
npm run lint:fix # ESLint autofix
npm run typecheck # Verificación TypeScript
npm run build    # Build producción
npm run start    # Servir build
```

## Estructura del proyecto

- `app/(frontend)`: layout y páginas públicas
- `app/(admin)`: Sanity Studio embebido
- `app/api`: endpoints (ej. newsletter/Mailchimp)
- `components`: componentes reutilizables UI
- `sanity`: schemas, desk structure, queries y utilidades CMS
- `styles`: estilos globales, mixins y variables
- `utils`: helpers compartidos

## Convenciones del template

- Componentes en carpeta propia con `index.tsx` + `*.module.scss`.
- Evitar estilos globales para UI de feature; usar módulos SCSS.
- Queries de Sanity separadas por `fragments` y `queries`.
- Integraciones de analytics condicionadas por consentimiento.

## Checklist al iniciar un proyecto nuevo

1. Actualiza metadata y dominio en `utils/seoHelper.ts`.
2. Sustituye componentes placeholder (`Header`, `Footer`, `Welcome`).
3. Configura variables de entorno y accesos de Sanity.
4. Revisa `sanity/schemas` y elimina tipos no usados.
5. Valida lint y build antes del primer deploy.

## Notas técnicas

- El build requiere variables de Sanity definidas (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`).
- `next.config.js` ya no ignora errores de TypeScript en build.
