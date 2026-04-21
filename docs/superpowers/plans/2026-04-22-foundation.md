# Context Layer Website Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Turborepo workspace, setup Next.js 15, and implement the ElevenLabs-inspired design system as the foundation for the mock website.

**Architecture:** A Turborepo monorepo managed by Bun. `apps/web` for Next.js 15 App Router. `packages/ui` for shared components. `packages/config` for shared tooling.

**Tech Stack:** Bun, Turborepo, Next.js 15, Tailwind CSS v4, Biome.

---

### Task 1: Initialize Turborepo Workspace with Bun

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `bun.lockb` (auto-generated)

- [ ] **Step 1: Initialize the root `package.json`**

```json
{
  "name": "context-layer",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "turbo run format"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "latest"
  }
}
```

- [ ] **Step 2: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 3: Run bun install to verify**

Run: `bun install`
Expected: Installs turbo and biome, creates `node_modules` and `bun.lockb`.

- [ ] **Step 4: Commit**

```bash
git add package.json turbo.json bun.lockb
git commit -m "chore: initialize turborepo root"
```

### Task 2: Setup `packages/config`

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/biome.json`
- Create: `packages/config/tsconfig.json`

- [ ] **Step 1: Create package.json for config**

```json
{
  "name": "@context-layer/config",
  "version": "0.0.0",
  "private": true
}
```

- [ ] **Step 2: Create base `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

- [ ] **Step 3: Create `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.8.3/schema.json",
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 80,
    "attributePosition": "auto"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/config
git commit -m "chore: add shared configurations"
```

### Task 3: Setup `apps/web` (Next.js 15)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.js`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/app/globals.css`

- [ ] **Step 1: Initialize Next.js package.json**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.0-rc.0",
    "react": "19.0.0-rc.0",
    "react-dom": "19.0.0-rc.0",
    "@tailwindcss/postcss": "4.0.0-alpha.16",
    "tailwindcss": "4.0.0-alpha.16",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "typescript": "^5",
    "@context-layer/config": "workspace:*"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` for web**

```json
{
  "extends": "@context-layer/config/tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Setup `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Setup Tailwind v4 in `app/globals.css`**

Based strictly on `DESIGN.md`:

```css
@import "tailwindcss";

@theme {
  --color-background: #f9f9f9;
  --color-surface: #ffffff;
  --color-primary: #000000;
  --color-warm-stone: rgba(245, 242, 239, 0.8);
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  
  --shadow-eleven-inset: rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.06) 0px 0px 0px 1px;
  --shadow-eleven-warm: rgba(78, 50, 23, 0.04) 0px 6px 16px;
  --shadow-eleven-card: rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px;
}

@layer base {
  body {
    @apply bg-background text-primary;
    -webkit-font-smoothing: antialiased;
  }
}
```

- [ ] **Step 5: Setup `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Context Layer",
  description: "Reverse-engineer the knowledge your codebase never had.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Public+Sans:wght@300;400;700&display=swap" rel="stylesheet"/>
        <style>{`
          @font-face {
              font-family: 'Waldenburg';
              src: local('Public Sans Light'), local('Helvetica Neue Light'), sans-serif;
              font-weight: 300;
          }
          @font-face {
              font-family: 'WaldenburgFH';
              src: local('Public Sans Bold'), local('Helvetica Neue Bold'), sans-serif;
              font-weight: 700;
          }
          .font-waldenburg { font-family: 'Waldenburg', sans-serif; font-weight: 300; }
          .font-waldenburg-bold { font-family: 'WaldenburgFH', sans-serif; font-weight: 700; }
          .inter-airy { letter-spacing: 0.18px; font-family: 'Inter', sans-serif; }
          body { font-family: 'Inter', sans-serif; letter-spacing: 0.16px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Setup `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Context Layer</h1>
      <p className="inter-airy text-[20px] text-neutral-600 mb-8 max-w-2xl text-center">
        Reverse-engineer the knowledge your codebase never had.
      </p>
      <button className="bg-warm-stone px-8 py-3 rounded-[30px] shadow-eleven-warm hover:opacity-90 transition-all text-primary font-waldenburg-bold uppercase tracking-[0.7px] text-[14px]">
        Enter Playground
      </button>
    </main>
  );
}
```

- [ ] **Step 7: Run bun install & commit**

Run: `bun install`
Run: `bun run dev` (Ensure it starts without crashing, then stop it).

```bash
git add apps/web bun.lockb
git commit -m "feat: scaffold nextjs 15 app with elevenlabs styling"
```
