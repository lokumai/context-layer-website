// The three demo personas.
// Usernames are public (they pick which env-var password to check); passwords
// MUST come from the environment. In dev, missing vars fall back to a
// predictable placeholder with a console warning — so the app boots locally
// without .env.local. In production, missing vars raise at login time.

export const PERSONA_IDS = ["empty", "partial", "full"] as const;
export type PersonaId = (typeof PERSONA_IDS)[number];

export function isPersonaId(v: unknown): v is PersonaId {
  return typeof v === "string" && (PERSONA_IDS as readonly string[]).includes(v);
}

export function personaEnvVar(id: PersonaId): string {
  return `AUTH_${id.toUpperCase()}_PASSWORD`;
}

const warned = new Set<PersonaId>();

/** Returns the expected password for a persona. Never logs the value. */
export function passwordForPersona(id: PersonaId): string {
  const key = personaEnvVar(id);
  const fromEnv = process.env[key];
  if (fromEnv && fromEnv.length > 0) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `[personas] ${key} is not set. In production, every persona password must come from the environment.`,
    );
  }

  if (!warned.has(id)) {
    // Dev fallback. Predictable, obvious, never shipped to prod.
    console.warn(
      `[personas] ${key} is not set; falling back to dev placeholder "changeme-${id}". Set ${key} in apps/web/.env.local to silence this warning.`,
    );
    warned.add(id);
  }
  return `changeme-${id}`;
}

/**
 * Constant-time-ish string compare. Auth.js doesn't provide one and we're not
 * doing real security here, but avoiding obvious early-return `===` is still
 * a good habit for password comparison.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function verifyCredentials(username: string, password: string): PersonaId | null {
  if (!isPersonaId(username)) return null;
  const expected = passwordForPersona(username);
  return safeEqual(password, expected) ? username : null;
}
