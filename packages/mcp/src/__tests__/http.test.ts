import type { AddressInfo } from "node:net";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { afterEach, describe, expect, it } from "vitest";
import { createHttpServer } from "../http";

// Phase 18 — HTTP transport smoke tests. We boot the Node http.Server on
// an ephemeral port (port: 0), then use the SDK's official client transport
// to exercise the real protocol handshake (initialize → notifications/initialized
// → tools/list).

interface Started {
  server: Awaited<ReturnType<typeof createHttpServer>>;
  url: string;
  close: () => Promise<void>;
}

async function start(opts: { token?: string } = {}): Promise<Started> {
  const server = await createHttpServer({ token: opts.token });
  await new Promise<void>((resolve) => {
    server.listen(0, resolve);
  });
  const addr = server.address() as AddressInfo;
  const url = `http://127.0.0.1:${addr.port}`;
  return {
    server,
    url,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

async function listToolsViaClient(url: string, token?: string): Promise<string[]> {
  const requestInit: RequestInit = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const transport = new StreamableHTTPClientTransport(new URL(`${url}/mcp`), {
    requestInit,
  });
  const client = new Client({ name: "vitest-http", version: "0.0.0" });
  await client.connect(transport);
  try {
    const { tools } = await client.listTools();
    return tools.map((t) => t.name).sort();
  } finally {
    await client.close();
  }
}

describe("createHttpServer", () => {
  let started: Started | null = null;

  afterEach(async () => {
    if (started) await started.close();
    started = null;
  });

  it("GET /healthz returns ok", async () => {
    started = await start();
    const res = await fetch(`${started.url}/healthz`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; transport: string };
    expect(body.ok).toBe(true);
    expect(body.transport).toBe("http");
  });

  it("advertises the three tools over HTTP without auth when no token configured", async () => {
    started = await start();
    const tools = await listToolsViaClient(started.url);
    expect(tools).toEqual(["ask_context_layer", "get_code_intelligence", "get_wiki_content"]);
  });

  it("rejects /mcp requests without a bearer when CONTEXT_LAYER_TOKEN is set", async () => {
    started = await start({ token: "supersecret" });
    const res = await fetch(`${started.url}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("unauthorized");
  });

  it("accepts requests with the right bearer", async () => {
    started = await start({ token: "supersecret" });
    const tools = await listToolsViaClient(started.url, "supersecret");
    expect(tools.length).toBe(3);
  });

  it("returns 404 on unknown paths", async () => {
    started = await start();
    const res = await fetch(`${started.url}/unknown`);
    expect(res.status).toBe(404);
  });

  it("OPTIONS /mcp returns 204 with CORS headers", async () => {
    started = await start();
    const res = await fetch(`${started.url}/mcp`, { method: "OPTIONS" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});
