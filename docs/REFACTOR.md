# Option 1 Deep Analysis — Split Marketing and Playground

## Executive Summary

Option 1 (separate deployable apps) is the right strategic direction for this repository, and it is fully compatible with the current architecture.  
The main risk is not rendering parity; it is **operational and ownership drift** after the split (links, SEO, testing, release flow, shared UI consistency, and styles).

If implemented with clear boundaries and pipeline ownership, this option gives you:

- static, GitHub Pages-compatible marketing delivery
- independent deploy cadence for playground + MCP on DigitalOcean
- cleaner future evolution (marketing content velocity without touching auth/mock runtime)

---

## Current-State Findings (evidence from codebase)

The current `apps/web` mixes static marketing and dynamic app concerns:

1. **Global auth middleware in app scope**
   - `apps/web/src/middleware.ts` protects non-public routes and redirects to `/login`.
2. **Server auth endpoints and auth runtime**
   - `apps/web/src/auth.ts`
   - `apps/web/src/app/api/auth/[...nextauth]/route.ts`
3. **Mock API routes used by hydrated playground runtime**
   - `apps/web/src/app/api/mocks/*`
4. **Root layout includes session + hydration providers**
   - `apps/web/src/app/layout.tsx` wraps all routes with:
     - `SessionProvider`
     - `HydrationProvider` (fetches `/api/mocks/bootstrap`)
5. **Marketing CTAs currently point to in-app routes**
   - `PlaygroundButton` default href is `/workspaces`. Fortunately, the component relies on a simple `<a href={href}>` and does not use NextAuth's `useSession()` directly, making it safe to extract.
   - `capability-sticky.tsx` links to `/login`.
6. **Tests assume single-host behavior**
   - e2e `marketing.spec.ts` expects CTA navigation to redirect to the local `/login` path (`/\/login/`).
7. **Coupled Component and Styling Logic**
   - Marketing pages heavily rely on `components/marketing` and `components/motion` located locally within `apps/web`.
   - Global styling and font loading (Inter, Raleway, Geist_Mono) are tightly coupled within `apps/web/src/app/globals.css` and `apps/web/src/app/layout.tsx`.
8. **Deployment Documentation Drift**
   - `docs/DEPLOYMENT.md` currently explicitly documents a unified architecture (`context-layer-web` handling both `/` and `/mcp-api/*` behind a single domain on DigitalOcean).

Conclusion: your app is not only “co-located”; it is coupled at route, provider, test assumptions, UI components, and global styling.

---

## Target Architecture for Option 1

Recommended structure:

```text
apps/
  marketing/   # static-only Next app for GitHub Pages (output: "export")
  web/         # current dynamic playground app (auth + mocks) for DO
packages/
  ui/          # shared primitives (including extracted marketing/motion components)
  ...
```

Domain strategy:

- `www.context-layer.dev` (or root) → GitHub Pages (marketing)
- `app.context-layer.dev` (or `playground.context-layer.dev`) → DigitalOcean (playground)
- `mcp-api` stays on playground-side infra (DO)

Key rule:

- Marketing app must not import auth/store/mock-runtime modules.
- Both apps should consume `components/marketing` and `components/motion` either via the shared `@context-layer/ui` package or through direct duplication if isolation is preferred over reusability.

---

## Risk Register (Option 1)

| Risk | Why it matters here | Impact | Likelihood | Mitigation |
|---|---|---:|---:|---|
| **Cross-domain CTA breakage** | Current CTAs point to `/workspaces`/`/login` as same-origin routes. | High | High | Introduce `NEXT_PUBLIC_PLAYGROUND_URL`; all “Open playground” links use it instead of relative paths. |
| **SEO/canonical drift** | Split domains can create duplicate content and weak canonical signals. | High | Medium | Define canonical/og URLs per app, submit separate sitemap(s), configure redirects for moved paths. |
| **GitHub Pages base path pitfalls** | If deployed as project pages (`/<repo>`), absolute asset and route assumptions can fail. | High | Medium | Decide early: custom domain vs project path. If project path, set `basePath`/`assetPrefix` and validate all links/assets. |
| **Shared component divergence** | Marketing and app UIs may drift if components are duplicated during extraction. | Medium | High | Move `components/marketing` and `components/motion` to `@context-layer/ui` package or enforce single source location consumed by both apps. |
| **Visual Inconsistency (Tailwind/Fonts)** | The new app might lose font definitions and global CSS setup. | High | High | Ensure `globals.css`, Tailwind config, and font loading logic from the current `layout.tsx` are perfectly replicated in `apps/marketing`. |
| **Provider leakage into marketing** | Reusing old root layout patterns can accidentally pull `next-auth`/hydration into static app. | High | Medium | Keep a minimal marketing root layout; add lint guard/checklist for forbidden imports (`auth`, stores, `/api/mocks`). |
| **CI/CD ownership confusion** | Existing workflow only builds Docker images; GitHub Pages pipeline is separate concern. | High | High | Create distinct workflows: `marketing-pages` and `playground-docker`; document owners, triggers, and rollback path per app. |
| **Test suite fragmentation** | Current tests are single-app assumptions; split can silently reduce coverage or produce false failures. | Medium | High | Move `marketing.spec.ts` to `apps/marketing`, update e2e assertions to check for external `href` values rather than local `/login` redirects. |
| **Analytics/session attribution gaps** | Cross-domain transitions can break session continuity and attribution. | Medium | Medium | Configure analytics for cross-domain measurement and ensure UTM propagation from marketing → playground. |
| **Brand/content inconsistency** | Fast-moving marketing pages can diverge from playground IA terminology constraints. | Medium | Medium | Add copy checklist enforcing canonical labels (Sources/Knowledge/Chatbot/Generate/Library) in both apps. |
| **Operational drift in docs/config** | Repo already shows deployment-doc drift signals (`DEPLOYMENT.md` assumes unified DO app). | Medium | High | Treat split as a docs-hardening moment: rewrite `DEPLOYMENT.md` to explain the dual deployment targets and update architecture notes. |

---

## Blind Spots Teams Commonly Miss During This Split

1. **“Open playground” behavior across environments**  
   Dev/staging/prod often need different targets. Hardcoding production URL causes local and preview friction. Use `NEXT_PUBLIC_PLAYGROUND_URL` populated differently per environment.

2. **Preview environments**  
   PR previews for marketing should link to matching playground environment (or clearly non-production target), not always production app.

3. **Legal and crawl controls**  
   `robots.txt`, sitemap, and canonical tags become app-specific assets post-split.

4. **Error-page behavior on GitHub Pages**  
   GitHub Pages has static 404 semantics; ensure unknown routes and trailing slash behavior are intentionally handled.

5. **Asset ownership and cache busting**  
   Shared logos/icons currently under `apps/web/public`; after split, define where brand assets live and how both apps consume versioned assets.

6. **Internal “design-system” route exposure**  
   `/(marketing)/design-system` is currently present; decide if it should be public on marketing host.

7. **Auth expectations in marketing tests**  
   Existing marketing test expects redirect to `/login`; this must become “navigates to external playground URL” checking the DOM attributes instead of URL routing.

8. **Release synchronization assumptions**  
   Once split, marketing deploy can happen independently; ensure launch announcements, copy, and playground capability claims stay synchronized.

---

## Rendering/Functionality Delta vs Current (for marketing pages)

Expected deltas are minor if split is done correctly:

- **Rendering parity:** should remain equivalent (Next static export is sufficient for current pages, provided global CSS and fonts are replicated).
- **Functionality parity:** retained for marketing interactions/animations.
- **Intentional change:** playground/login navigation becomes cross-domain rather than same-origin.

Primary quality risk is **integration correctness**, not visual rendering.

---

## Recommended Guardrails Before Execution

1. Define canonical domain map (`marketing`, `playground`, optional `mcp`) and freeze it.
2. Define one environment contract for playground link target (`NEXT_PUBLIC_PLAYGROUND_URL`).
3. Define import boundary rules (marketing cannot import auth/store/mock server modules).
4. Decide component sharing strategy (e.g., move `components/marketing` and `components/motion` to `packages/ui`).
5. Split CI workflows and ownership per app before moving files.
6. Update e2e strategy to test:
   - marketing static render
   - external CTA correctness (href checks instead of page navigation)
   - playground auth/gating behavior
7. Update docs (`README`, `DEPLOYMENT.md`, architecture notes) in same PR as refactor to avoid drift.

---

## Practical Go/No-Go Checklist

Proceed only when all are true:

- [ ] Marketing app builds as static output (`output: "export"`) with no server-only imports.
- [ ] All playground CTAs resolve via configured external base URL (`NEXT_PUBLIC_PLAYGROUND_URL`).
- [ ] SEO metadata/canonicals/sitemap are domain-correct.
- [ ] Global styling and font loading are correctly established in the new app's root layout.
- [ ] Local UI dependencies are either moved to `@context-layer/ui` or safely duplicated.
- [ ] CI has separate pipelines for Pages and Docker/DO paths.
- [ ] Tests reflect split-domain reality (no stale same-origin assumptions in `marketing.spec.ts`).
- [ ] `DEPLOYMENT.md` matches actual repository dual-target workflows.

---

## Execution Phases

To execute Option 1 safely and incrementally, we will follow a 3-phase track:

### Phase 1: Foundation & Shared UI
- Extract `components/marketing` and `components/motion` from `apps/web` into `@context-layer/ui` (or a dedicated package).
- Ensure `apps/web` (Playground) still builds and functions correctly with these components coming from the shared location.
- Validate that the existing global styles and Tailwind configuration can be cleanly shared or duplicated.

### Phase 2: Scaffolding the Marketing App
- Create `apps/marketing` as a new Next.js application configured for static export (`output: "export"`).
- Replicate global styles (`globals.css`), Tailwind setup, fonts, and the minimal root layout (without NextAuth/Session providers).
- Move the `src/app/(marketing)` routes from `apps/web` into `apps/marketing`.
- Introduce `NEXT_PUBLIC_PLAYGROUND_URL` and update all cross-domain CTAs (e.g., `PlaygroundButton`).
- Relocate `marketing.spec.ts` to `apps/marketing` and update the assertions to check for external `href`s instead of local routing.

### Phase 3: Cleanup & CI/CD
- Remove the stale marketing routes and legacy dependencies from `apps/web`.
- Set up independent GitHub Actions pipelines: one for deploying `apps/marketing` to GitHub Pages, and retaining the existing workflow for `apps/web` and MCP on DigitalOcean.
- Update `docs/DEPLOYMENT.md` and architecture notes to accurately reflect the finalized dual-target deployment workflow.