import type { MocksManifest } from "../types.js";
import { readJSON } from "./_fs.js";

export async function getManifest(): Promise<MocksManifest> {
  return readJSON<MocksManifest>("metadata.json");
}
