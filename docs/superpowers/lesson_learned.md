# When "Superpowers" Dumb Down Your AI: A Vibe Coding Lesson Learned

I recently spent 4-5 hours trying to build a website for my new project, the Context Layer Ecosystem. I had everything prepared perfectly. I provided detailed documentation: `SEED.md` for the tech stack, `UI_UX.md` for the architecture, and `DESIGN.md` for the visual identity. 

I even generated stunning, modern UI mockups using Stitch by Google (such as `good_chatbot.png` and `good_logs.png`). The goal was to build an interface with a premium aesthetic—whisper-thin typography, complex shadows, and modern components using Next.js, Tailwind v4, and shadcn/ui.

To build it, I used the best tools available in 2026: Claude Opus 4.7, the current state-of-the-art (SOTA) model. To keep the project organized, I paired it with "Superpowers," an AI agent plugin with over 100K stars on GitHub. 

I expected magic. Instead, what I got was a disaster.

## The Catastrophic Output

After hours of letting the AI work, I opened the browser to see the result. It was terrible. 

Instead of the modern, sleek designs I had in my Stitch mockups, the UI looked like a basic 2015 prototype. The elegant fonts were gone, replaced by heavy, default text. The complex shadows were clunky. The components were rigid and lifeless. 

As an expert software engineer, this was a mystery to me. How could Claude Opus 4.7—a model capable of incredible reasoning and "vibe coding"—fail so completely? I had provided the exact tech stack, the exact design tokens, and the exact user flows. 

I decided to dig into the codebase to find out what went wrong.

## The Investigation

The first thing I checked was the tech stack. My `SEED.md` explicitly commanded the use of `shadcn/ui` to ensure high-quality base components. But when I looked at my `package.json`, there were zero Radix UI dependencies. 

Instead of using `shadcn/ui`, the codebase was filled with rudimentary, custom-built components in `apps/web/components/ui`. 

Then I checked the typography. My `DESIGN.md` demanded a premium font called `Waldenburg` for headings. The AI added the CSS classes for it, but completely failed to actually load the font files. The browser simply fell back to a default font, ruining the entire visual vibe.

Why did Claude Opus 4.7 ignore my `SEED.md` and `DESIGN.md` instructions?

## The Root Cause: Micro-Management

The culprit wasn't Claude. It was the Superpowers plugin.

Superpowers works by breaking down a large project into smaller, step-by-step markdown plans. It generated a plan file called `2026-04-22-09-design-pass.md`. 

When I opened this plan, the mystery was solved. The plugin had generated strict, narrow instructions with hardcoded, oversimplified code snippets. 
- Instead of telling the AI to "install shadcn/ui," the plan commanded the AI to "Introduce a small set of shared primitives" and provided basic, hardcoded Tailwind snippets for a `Card` and `Button`.
- Instead of letting the AI interpret the complex shadow system from the design document, the plan forced the AI to use a clunky variant system.

The Superpowers plugin hijacked the process. When Claude Opus 4.7 executed these plans, it was forced to act as a "dumb copy-paster." The rigid plans over-constrained the AI, overriding its natural reasoning capabilities and preventing it from "vibe coding."

## The Lesson Learned

This was an important lesson, probably one of the first in the world regarding modern AI-assisted engineering: **Do not micro-manage a SOTA model.**

Plugins that force strict, step-by-step plans might have been necessary for older models. But when you use a highly capable model like Claude Opus 4.7, strict planning tools can actually dumb down the output. 

When you want an AI to capture a "vibe" or implement a complex design system, you need to give it the context—your SEED files, your UI/UX docs, and your mocks—and get out of its way. Forcing an advanced AI to follow a simplistic, generated checklist will only guarantee a simplistic, generated result. 

I wasted 5 hours learning this the hard way, but it completely changed how I approach AI coding. Give your AI the context, not the handcuffs.
