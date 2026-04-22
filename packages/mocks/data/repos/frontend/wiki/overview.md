# Frontend Application

The `frontend` is a Next.js 16 web application that provides three distinct user interfaces against the TMF Product Catalog backend: **Builder** (admin create), **Viewer** (admin manage + publish), and **Store** (public browse). It is the only component in the workspace that is written in TypeScript/React; everything it talks to is Python. All traffic goes through `api-gateway` at `http://localhost:8000/api/v1`.

Tech: React 19, Next.js App Router, Tailwind CSS 4 (brand accent `#FF7900`), React Hook Form + Zod for forms, Framer Motion for animations. Auth is JWT in localStorage, attached to every `apiClient` request; a registered 401 callback forces logout + redirect to `/login`.

## Architecture

### Routing

- `/` — redirects to `/builder` if authenticated, otherwise `/login`.
- `/login` — public form; on submit posts to `/auth/login` via gateway, stashes the returned JWT in localStorage.
- `/builder` — protected, wrapped by `ProtectedRoute`.
- `/viewer` — protected, wrapped by `ProtectedRoute`.
- `/store` — public; no auth, served via `store-query-service` through the gateway.

`ProtectedRoute` is a client component that reads `isAuthenticated` from `AuthContext` and either renders children or redirects to `/login`.

### Authentication Context

`web-ui/src/contexts/AuthContext.tsx` holds the JWT + user `{username, role}` and exposes `login()` / `logout()`. On mount it synchronously reads the token from localStorage to avoid auth flicker during reloads. Changes to the token are mirrored into `apiClient.setToken(token)`. The context also registers an unauthorized handler with `apiClient`; any 401 response triggers `logout()` → redirect.

The root layout (`web-ui/src/app/layout.tsx`) wraps the whole tree in `<AuthProvider>`.

### Forms and Validation

Each entity type has a dedicated form component under `web-ui/src/components/forms/`:

- `CharacteristicForm.tsx` — name + value + unit_of_measure (enum).
- `SpecificationForm.tsx` — name + multi-select of characteristics (fetched from `/characteristics`).
- `PricingForm.tsx` — name + value + unit + currency (enum).
- `OfferingForm.tsx` — name + description + specs/prices multi-select + channel checkboxes + Publish button.

All forms follow the same pattern: Zod schema → `useForm({ resolver: zodResolver(schema) })` → field registration → inline `formState.errors` → async submit handler calling `apiClient`.

The Offering form's Publish flow uses a custom `useSagaPolling` hook (`web-ui/src/lib/hooks.ts`): after `POST /offerings/{id}/publish`, it polls `GET /offerings/{id}` every 2s for lifecycle transitions. If the offering reaches PUBLISHED a success toast fires; if it reverts to DRAFT a failure toast fires.

### API Client

`web-ui/src/lib/api-client.ts` is a single generic client with `get<T>`, `post<T>`, `put<T>`, `delete<T>` methods. Base URL from `NEXT_PUBLIC_API_URL`, JWT injection, 401 callback. No caching layer — every page refetches on mount and after mutations. Simple, predictable.

## Endpoints

### `/login`

Public. Username/password form. On success, `apiClient.post('/auth/login', creds)` → stash token → redirect to `/builder`.

### `/builder`

Protected. Tabbed interface with four tabs, one per entity type. Each tab lazy-fetches its dependency data (e.g., the Specification tab fetches `/characteristics`), renders the form, and handles create-on-submit. The Offering tab's Publish button is the saga-polling entry point.

### `/viewer`

Protected. Same four tabs; each shows a `DataTable` with search, sort, pagination. Edit opens a modal with the same form component pre-filled. Delete shows a confirmation dialog then hits `apiClient.delete(`/${type}/${id}`)`. For offerings, a Publish column exposes the same saga-polling flow as Builder.

### `/store`

Public, unauthenticated. Renders a grid of offering cards. Filters (keyword, price range, channels, characteristics) live in a `FilterPanel` component and sync to URL search params via `useRouter().push()`. On mount and on filter change, fires `apiClient.get('/store/search', { params })`. Clicking a card opens a detail modal with the full denormalized offering.

## Testing

The existing suite is thin — the team plans Playwright or Cypress against a live Docker Compose backend for the critical journeys. The recommended scenarios:

1. **Authentication** — valid login redirects to `/builder`; invalid login shows error; expired token redirects to `/login` on the next request.
2. **Builder end-to-end** — create a characteristic → appears in `/viewer`; create a spec referencing it (multi-select populated); create a price; create a draft offering.
3. **Offering publication** — click Publish, watch the spinner, verify the success toast fires on PUBLISHED. Inject a failure on one of the saga steps and assert the offering reverts to DRAFT with an error toast.
4. **Viewer management** — search, sort, paginate, edit-in-modal, delete-with-confirm. Verify the list refetches after each mutation.
5. **Store filtering** — apply every filter dimension; confirm URL sync; confirm the backend receives the corresponding query params; refresh the page and confirm filters rehydrate from URL.

The frontend also carries lightweight Vitest + React Testing Library tests for form components (e.g., `SpecificationForm` — renders, fetches characteristics, submits success, rejects empty selection).
