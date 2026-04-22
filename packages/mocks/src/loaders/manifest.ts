import type { MocksManifest } from "../types";
import { readJSON } from "./_fs";

export async function getManifest(): Promise<MocksManifest> {
  return readJSON<MocksManifest>("metadata.json");
}
