import { isValidPersona, type Persona } from "@context-layer/mocks";

export interface PersonaUser {
  id: Persona;
  name: string;
  email: string;
  persona: Persona;
}

const personaDisplay: Record<Persona, { name: string; email: string }> = {
  full: { name: "Full Demo", email: "full@contextlayer.io" },
  partial: { name: "Partial Demo", email: "partial@contextlayer.io" },
  empty: { name: "Empty Demo", email: "empty@contextlayer.io" },
};

export function authorizePersona(input: { username?: string | null }): PersonaUser | null {
  const value = (input.username ?? "").trim().toLowerCase();
  if (!isValidPersona(value)) return null;
  const display = personaDisplay[value];
  return { id: value, persona: value, name: display.name, email: display.email };
}
