# Context Layer — Playground

The auth-gated demo playground for Context Layer.

## Development
```sh
bun dev
```
Starts the server on [localhost:3000](http://localhost:3000).

## Build
```sh
bun run build
```
Generates a standalone Node.js production bundle.

## Tech Stack
- Next.js 16 (Standalone)
- React 19
- Auth.js v5
- Zustand (Persona persistence)
- Shared components from `@context-layer/ui`
- Mock data from `@context-layer/mocks`

## Demo Personas
Sign in via `/login` with personas: `empty`, `partial`, or `full`.
