# The Day I Handcuffed a Genius: A Lesson in Modern AI Vibe Coding

It was late April 2026, and I was finally ready to build the front-end for my biggest project yet: the Context Layer Ecosystem. 

As an experienced software engineer, I knew that preparation was everything. I didn’t just jump into the code. I spent days crafting the perfect context for the AI. I wrote a `SEED.md` file that strictly defined the tech stack: Next.js 15, Tailwind CSS v4, and the robust `shadcn/ui` library. I wrote a `UI_UX.md` document mapping out the exact user flow. Finally, I polished a `DESIGN.md` spec detailing a premium, ElevenLabs-inspired aesthetic—think whisper-thin *Waldenburg* fonts, warm stone tones, and complex, sub-0.1 opacity floating shadows. 

To top it all off, I used Stitch by Google to generate a set of gorgeous, modern UI mockups. I had the perfect vision. Now, I just needed the perfect builder.

## The Dream Team (Or So I Thought)

For the heavy lifting, I brought in Claude Opus 4.7, the reigning state-of-the-art (SOTA) model. To ensure the massive project stayed organized, I paired Claude with "Superpowers," a legendary AI agent plugin boasting over 100,000 stars on GitHub. 

The idea behind Superpowers is simple and seductive: it breaks massive coding projects into small, highly structured markdown plans so the AI doesn't get lost or hallucinate. 

I gave the system my docs, handed over the mockups, pressed enter, and stepped away. For 4 to 5 hours, my terminal hummed as Claude Opus 4.7 and Superpowers worked together to build my dream interface.

## The Reveal

When the process finally finished, I excitedly opened `localhost` in my browser. 

My heart sank. 

Instead of the sleek, modern interface I had designed, I was staring at something that looked like a basic admin dashboard from 2015. 
- The "whisper-thin" *Waldenburg* font? Missing entirely. The text was a heavy, generic default font.
- The complex, floating shadows? Replaced by clunky, solid borders.
- The beautiful `shadcn/ui` components? Gone. The UI felt rigid, lifeless, and amateur. 

I was furious. I had just wasted five hours of my day. How could Claude Opus 4.7—a model famous for its incredible reasoning and "vibe coding" capabilities—fail this badly? 

## The Detective Work

I immediately opened my code editor to investigate. The first place I looked was `package.json`. 

My `SEED.md` explicitly commanded the use of `shadcn/ui`. But looking at the dependencies, there wasn't a single Radix UI package installed. Instead, I found a folder full of rudimentary, custom-built UI primitives. 

Next, I checked the typography. The AI had correctly added `.font-waldenburg` CSS classes, but it had completely forgotten to actually load the font files via `@font-face`. Because the font wasn't there, the browser fell back to a standard sans-serif font, instantly destroying the premium "vibe."

I was baffled. Claude doesn't usually ignore strict architectural guidelines. Why did it happen this time? 

## Finding the Smoking Gun

I navigated to the `docs/superpowers/plans/` directory. This is where the Superpowers plugin outputs the step-by-step markdown plans that dictate the AI's actions. 

I opened a file named `2026-04-22-09-design-pass.md`. Reading it, the mystery evaporated. 

The Superpowers plugin hadn't just organized the project; it had micro-managed it to death. The generated plan was full of narrow, rigid instructions and hardcoded, simplistic code snippets. 
- Instead of telling Claude to "Install and configure `shadcn/ui` based on the SEED file," the plan ordered the AI to: *"Introduce a small set of shared primitives."* It then forced Claude to copy-paste a terribly basic `Card` and `Button` component written in raw Tailwind.
- Instead of letting Claude organically build the shadow system based on my `DESIGN.md`, the plan locked the AI into a rigid, oversimplified CSS variant system.

The Superpowers plugin had completely hijacked the process.

## The Lesson Learned

When Claude Opus 4.7 was reading those plans, it wasn't acting as a brilliant software engineer. It was forced to act as a dumb copy-paster. The strict, narrow constraints of the Superpowers plan overrode Claude's natural reasoning capabilities. It turned a SOTA "vibe coder" into a blind assembly line worker.

This was a massive wake-up call and one of the most important lessons I've learned in modern AI-assisted engineering: **Do not micro-manage a genius.**

Back in 2024, when AI models easily lost their train of thought, strict planning tools like Superpowers were absolutely necessary. But the rules have changed. Today's highly capable models don't need to be spoon-fed step-by-step code snippets. 

When you want an advanced AI to capture a complex "vibe" or implement a modern design system, your job is to give it the context—your SEED files, your UI/UX docs, your mockups—and then get out of its way. 

If you put a SOTA model in handcuffs, don't be surprised when it hands you a rigid, lifeless result. I lost five hours learning this the hard way, but it fundamentally changed how I code with AI. Give your AI the context, not the constraints.
