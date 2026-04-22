# Identity Service

The Identity Service is the authentication authority for the platform. It implements zero-trust by issuing RS256-signed JWTs that every other service validates independently against a publicly-exposed RSA public key. It is the root of trust — lose the private key, everything else becomes impersonatable.

The service runs on port 8001 and is reachable via the gateway at `http://localhost:8000/api/v1/auth/*`. The domain is small: a single `User` aggregate with `id` (UUID), `username` (unique), `password_hash` (bcrypt cost 12), `role` (ADMIN | USER), and `created_at`. Demo fixtures ship with `admin/admin` and `user/user` accounts for development.

## Architecture

### Asymmetric Key Signing

The service holds the RSA private key in environment variables (injected from Kubernetes secrets in production) and exposes the public key via `GET /api/v1/auth/public-key`. Downstream services fetch this key once at startup, cache it, and verify every JWT locally — removing per-request network hops and making the identity-service a cold-path dependency after boot.

JWTs use RS256 with a one-hour default lifetime. Payload: `sub` (user ID), `username`, `role`, `iat`, `exp`.

### Login Flow

1. Client posts `OAuth2PasswordRequestForm` to `/api/v1/auth/login`.
2. Service queries the users table (`select * from users where username = ?`).
3. `verify_password(plain, hashed)` uses constant-time bcrypt comparison.
4. On success, `create_access_token()` signs an RS256 JWT with the user's claims.
5. Response: `{"access_token": "...", "token_type": "bearer"}`.

On invalid credentials, the endpoint raises `HTTPException(401, detail="Incorrect username or password")` — deliberately generic to avoid username enumeration.

### RBAC Model

Two roles. The shared chassis ships a `RoleChecker` dependency that downstream services use to gate admin-only routes. Role is a first-class JWT claim; downstreams don't call identity-service to check roles.

### Data Store

PostgreSQL, SQLAlchemy 2.0 (async via `asyncpg`), Alembic for schema migrations. The initial migration creates the `users` table with a unique constraint on `username` and seeds the two demo users.

### Events

Identity does **not** emit domain events. It is a utility service — pure function from credentials to tokens. No outbox, no RabbitMQ integration.

### Chassis Integration

Imports `common.logging.setup_logging()`, `common.tracing.setup_tracing()` + `instrument_fastapi()`, and the Pydantic Settings base. Logging and tracing look identical to the six other backend services, so a login request shows up in Kibana and Zipkin with the same schema as everything else.

## Endpoints

### `POST /api/v1/auth/login`

Form-encoded: `username`, `password`.

Success (200):
```json
{"access_token": "eyJhbGciOiJSUzI1NiIs...", "token_type": "bearer"}
```

Failure (401):
```json
{"detail": "Incorrect username or password"}
```

### `GET /api/v1/auth/public-key`

Unauthenticated. Returns:
```json
{"public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----", "algorithm": "RS256"}
```

Newline escaping in the env var is corrected before returning.

### `GET /health`

Returns `{"status": "healthy", "service": "identity-service"}`. Used by the gateway's dependency-health endpoint.

## Testing

`pytest` + `pytest-asyncio` + `httpx.AsyncClient` + `testcontainers` for real Postgres integration. Test files in `services/identity-service/tests/`.

Coverage emphases:

- **Happy login** — correct credentials → 200 with structurally valid JWT (verifiable against the public key, contains expected claims).
- **Wrong password / unknown user** — both yield 401 with the same generic message.
- **Token expiration** — tokens past `exp` fail verification in downstream code.
- **Public-key retrieval** — returns a valid RSA key in PEM; algorithm field is `RS256`.
- **Bcrypt properties** — same password → different hashes (random salt); timing-safe comparison.
- **Zero-trust end-to-end** — under `tests/e2e/test_service_security.py`, calling a write service directly without a token yields 401; with a valid token, 200 — proving downstreams validate independently.
- **DB integration** — testcontainers spin up real Postgres; migrations apply; unique-username constraint enforced.
