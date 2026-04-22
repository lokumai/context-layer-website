// Internal reference page — the Phase 2 design-token showcase. Not linked from marketing surfaces.
import { Button } from "../../../../ui/button"

export default function DesignSystemShowcase() {
  return (
    <main className="min-h-screen bg-gray-light p-12 space-y-16">
      {/* 1. Header */}
      <section className="space-y-4">
        <h1 className="text-display-hero text-black">Design System</h1>
        <p className="text-body-large text-gray-dark max-w-2xl">
          Implementing the Context Layer visual identity. Premium, ethereal, and typography-led.
        </p>
      </section>

      {/* 2. Typography Scale */}
      <section className="bg-white p-8 rounded-card shadow-outline-ring space-y-8">
        <h2 className="text-section-heading text-black border-b border-border pb-4">Typography</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Display Hero</p>
              <h1 className="text-display-hero text-black">Whisper Thin</h1>
            </div>
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Section Heading</p>
              <h2 className="text-section-heading text-black">Section Title</h2>
            </div>
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Card Heading</p>
              <h3 className="text-card-heading text-black">Card Component</h3>
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Body Large</p>
              <p className="text-body-large text-gray-dark">High-fidelity institutional memory.</p>
            </div>
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Body Standard (+0.18px tracking)</p>
              <p className="text-body text-gray-dark">
                The design feels like a premium audio product brochure: clean, spacious, and confident.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-tiny text-gray-warm uppercase">Code</p>
              <code className="text-code bg-gray-near p-4 block rounded-standard text-black">
                const context = await CL.analyze("./src");
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Buttons & Interactive */}
      <section className="bg-white p-8 rounded-card shadow-outline-ring space-y-8">
        <h2 className="text-section-heading text-black border-b border-border pb-4">Interactive</h2>
        <div className="flex flex-wrap gap-8 items-end">
          <div className="space-y-4">
            <p className="text-tiny text-gray-warm uppercase">Pill Buttons</p>
            <div className="flex gap-4">
              <Button className="rounded-pill px-6 h-10 bg-black text-white hover:opacity-80 transition-opacity">
                Primary Pill
              </Button>
              <Button variant="outline" className="rounded-pill px-6 h-10 border-border bg-white text-black shadow-card hover:bg-gray-light transition-colors">
                Secondary Pill
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-tiny text-gray-warm uppercase">Signature Warm Stone</p>
            <Button className="rounded-warm-btn px-8 h-12 bg-stone-translucent text-black shadow-warm hover:scale-[1.02] transition-all">
              Featured Action
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-tiny text-gray-warm uppercase">Waldenburg Bold Uppercase</p>
            <button className="text-button-upper px-4 py-2 bg-black text-white rounded-minimal hover:opacity-90">
              Generate Now
            </button>
          </div>
        </div>
      </section>

      {/* 4. Elevation & Shadows */}
      <section className="space-y-8">
        <h2 className="text-section-heading text-black">Elevation & Depth</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-card shadow-inset-border border border-transparent">
            <p className="text-body-medium text-black">Level 0.5: Inset</p>
            <p className="text-caption text-gray-dark mt-2">Internal edge definition.</p>
          </div>
          <div className="bg-white p-6 rounded-card shadow-outline-ring border border-transparent hover:shadow-card transition-shadow">
            <p className="text-body-medium text-black">Level 1: Outline</p>
            <p className="text-caption text-gray-dark mt-2">Standard card elevation.</p>
          </div>
          <div className="bg-white p-6 rounded-warm-btn shadow-warm border border-transparent">
            <p className="text-body-medium text-black">Level 3: Warm lift</p>
            <p className="text-caption text-gray-dark mt-2">Signature tinted shadow.</p>
          </div>
        </div>
      </section>

      {/* 5. Colors */}
      <section className="bg-white p-8 rounded-card shadow-outline-ring space-y-8">
        <h2 className="text-section-heading text-black border-b border-border pb-4">Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <ColorSwatch color="bg-white" name="White" hex="#ffffff" border />
          <ColorSwatch color="bg-gray-light" name="Gray Light" hex="#f5f5f5" />
          <ColorSwatch color="bg-stone" name="Stone" hex="#f5f2ef" />
          <ColorSwatch color="bg-black" name="Black" hex="#000000" lightText />
          <ColorSwatch color="bg-gray-dark" name="Gray Dark" hex="#4e4e4e" lightText />
          <ColorSwatch color="bg-gray-warm" name="Gray Warm" hex="#777169" lightText />
          <ColorSwatch color="bg-gray-near" name="Gray Near" hex="#f6f6f6" />
        </div>
      </section>
    </main>
  )
}

function ColorSwatch({ color, name, hex, lightText = false, border = false }: { color: string, name: string, hex: string, lightText?: boolean, border?: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`h-16 w-full rounded-standard ${color} ${border ? 'border border-border' : ''}`} />
      <div>
        <p className="text-micro text-black font-semibold">{name}</p>
        <p className="text-tiny text-gray-warm">{hex}</p>
      </div>
    </div>
  )
}
