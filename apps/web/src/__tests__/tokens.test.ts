import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

describe("Design System Tokens", () => {
  const globalsCssPath = path.resolve(__dirname, "../app/globals.css")
  const globalsCss = fs.readFileSync(globalsCssPath, "utf-8")

  it("defines all mandatory color tokens from DESIGN.md", () => {
    const mandatoryColors = [
      "--color-white",
      "--color-gray-light",
      "--color-stone",
      "--color-black",
      "--color-gray-dark",
      "--color-gray-warm",
      "--color-border",
    ]
    
    for (const color of mandatoryColors) {
      expect(globalsCss).toContain(color)
    }
  })

  it("defines all mandatory shadow tokens from DESIGN.md", () => {
    const mandatoryShadows = [
      "--shadow-inset-border",
      "--shadow-outline-ring",
      "--shadow-card",
      "--shadow-warm",
    ]
    
    for (const shadow of mandatoryShadows) {
      expect(globalsCss).toContain(shadow)
    }
  })

  it("defines the typography utility classes", () => {
    const mandatoryUtilities = [
      "@utility text-display-hero",
      "@utility text-section-heading",
      "@utility text-body",
      "@utility text-button-upper",
    ]
    
    for (const utility of mandatoryUtilities) {
      expect(globalsCss).toContain(utility)
    }
  })

  it("uses Raleway for display typography", () => {
    expect(globalsCss).toContain("--font-display: var(--font-raleway)")
  })

  it("uses Inter for sans typography", () => {
    expect(globalsCss).toContain("--font-sans: var(--font-inter)")
  })
})
