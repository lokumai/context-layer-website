# Deployment

The context-layer architecture is split into two independent deployments to maximize performance, isolate concerns, and leverage static hosting.

## 1. Marketing Website — GitHub Pages

The marketing website (`apps/marketing`) is a fully static Next.js export. It is automatically deployed to GitHub Pages.

- **URL**: `www.context-layer.dev` (or the repository root)
- **CI/CD**: `.github/workflows/deploy-pages.yaml`
- **Output**: `./apps/marketing/out`

Any pushes to `main` will trigger the GitHub Action to build and deploy the marketing site.

---

## 2. Playground & MCP — DigitalOcean App Platform via GHCR

The core application runtime consists of two services deployed together on DigitalOcean App Platform:

- **`context-layer-web`** — Next.js 16 (standalone) on port 3000. Handles authentication, mock runtime, and the Playground UI.
- **`context-layer-mcp`** — Streamable-HTTP MCP server on port 8765.

Both services live behind a single domain (e.g., `app.context-layer.dev`). `/` routes to the web playground, and `/mcp-api/*` routes to the MCP server.

### First-time setup

You only do this once.

### 1. Create the DigitalOcean App

```sh
doctl apps create --spec .do/app.yaml
```

The command prints an app id (a UUID). Save it — you'll need it as a GitHub repo secret.

> If `doctl apps create` rejects the spec because the GHCR images don't exist yet, push to `main` first to populate GHCR, then re-run.

### 2. Configure GitHub repo secrets

In GitHub → Settings → Secrets and variables → Actions, add:

| Name | Value |
|------|-------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Personal access token from DO → API → Generate New Token (scope: `read+write`). |
| `DIGITALOCEAN_APP_ID` | The app id from step 1. |

GHCR auth uses the built-in `GITHUB_TOKEN` — no extra secret required, but the workflow's `permissions: packages: write` block must stay in place.

### 3. Configure DO env-var secrets

In DO → Apps → context-layer → Settings → Components, set the **encrypted secrets** for both services:

**`web` component:**

| Variable | Value | Notes |
|----------|-------|-------|
| `AUTH_SECRET` | `openssl rand -base64 32` output | Auth.js JWT signing |
| `AUTH_EMPTY_PASSWORD` | any string | Password for the `empty` demo persona |
| `AUTH_PARTIAL_PASSWORD` | any string | Password for the `partial` demo persona |
| `AUTH_FULL_PASSWORD` | any string | Password for the `full` demo persona |

**`mcp` component:**

| Variable | Value | Notes |
|----------|-------|-------|
| `CONTEXT_LAYER_TOKEN` | `openssl rand -hex 32` output | Bearer token required on every `/mcp-api/*` request |

`CONTEXT_LAYER_WORKSPACE` and `PORT` are baked into `.do/app.yaml` as plain values — no secret needed.

### 4. Deploy

```sh
git push origin main
```

GitHub Actions (`.github/workflows/deploy.yaml`) will:

1. Build `context-layer-web` and `context-layer-mcp` images in parallel.
2. Push both to `ghcr.io/<owner>/...:latest` and `:<sha>`.
3. Run `doctl apps update $DIGITALOCEAN_APP_ID --spec .do/app.yaml --wait`, which triggers a DO rollout.

Total wall time: ~6–8 minutes from `git push` to live.

---

## Local Docker test (recommended before the first deploy)

Build both images locally to confirm the multi-stage builds pass on your machine:

```sh
# from repo root
docker build -f apps/web/Dockerfile -t context-layer-web .
docker build -f packages/mcp/Dockerfile -t context-layer-mcp .

# run web (foreground)
docker run --rm -p 3000:3000 \
  -e AUTH_SECRET=dev-secret \
  -e AUTH_EMPTY_PASSWORD=empty \
  -e AUTH_PARTIAL_PASSWORD=partial \
  -e AUTH_FULL_PASSWORD=full \
  context-layer-web

# in another terminal: run mcp
docker run --rm -p 8765:8765 \
  -e CONTEXT_LAYER_TOKEN=dev-token \
  -e CONTEXT_LAYER_WORKSPACE=microservices-product-catalog \
  context-layer-mcp

# smoke
curl http://localhost:3000/                  # 200, Playground entry
curl http://localhost:3001/                  # 200, Marketing site (when running locally via bun dev)
curl http://localhost:8765/healthz           # { ok: true, transport: "http" }
curl -H "Authorization: Bearer dev-token" \
     -H "Accept: application/json,text/event-stream" \
     -X POST http://localhost:8765/mcp \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

If both containers serve their health checks, the production deploy will too — DO mostly just pulls the image and forwards traffic.

---

## Connecting Claude Desktop to the remote MCP

After the DO deploy is live, update Claude Desktop's config (macOS path: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "context-layer": {
      "url": "https://<your-do-app>.ondigitalocean.app/mcp-api/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer <CONTEXT_LAYER_TOKEN>"
      }
    }
  }
}
```

Restart Claude Desktop. The three tools (`get_wiki_content`, `get_code_intelligence`, `ask_context_layer`) should appear in the tool picker. If they don't:

1. Hit `/mcp-api/healthz` directly — confirm 200 + `{ ok: true }`.
2. Send a test POST to `/mcp-api/mcp` with a fresh bearer (see the `curl` example above) — confirm the server doesn't 401.
3. Tail DO logs: `doctl apps logs <APP_ID> --component mcp --follow`.

Cursor uses the same JSON shape under its MCP settings.

---

## Demo URLs to share with clients

Once deployed, the URLs you'll share are:

- **Marketing**: `https://<your-github-user>.github.io/<repo>/` (or custom domain)
- **Playground**: `https://<your-do-app>.ondigitalocean.app/`
- **Login**: `https://<your-do-app>.ondigitalocean.app/login` (use persona passwords)
- **MCP healthcheck**: `https://<your-do-app>.ondigitalocean.app/mcp-api/healthz`
- **MCP endpoint**: `https://<your-do-app>.ondigitalocean.app/mcp-api/mcp`

For the live demo flows, follow `AGENTS.md` and the instructions in the playground.

---

## Operational notes

- **Image sizes**: web ≈ 200 MB, mcp ≈ 130 MB. Layer caching in GH Actions keeps incremental builds under 90 s.
- **Cold start**: standalone Next on `basic-xxs` (1 GB RAM) cold-boots in ~2 s; MCP is ~1 s. DO health checks tolerate that with the `initial_delay_seconds` set in `.do/app.yaml`.
- **Logs**: `doctl apps logs <APP_ID> --component web --follow` (or `mcp`).
- **Rollback**: in the DO UI → Deployments tab → pick a previous build → Promote. The container image hash is preserved per deployment.
- **Custom domain**: in DO → Apps → context-layer → Settings → Domains. Add a CNAME pointing to the DO endpoint. TLS is auto-provisioned via Let's Encrypt.
- **Cost**: two `basic-xxs` instances ≈ $10/mo combined. Bandwidth is metered separately.
