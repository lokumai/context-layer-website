import { Button } from "../../ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24">
      <h1 className="text-4xl font-light tracking-tight">Context Layer</h1>
      <p className="text-neutral-500 text-lg">Infrastructure is ready. 🚀</p>
      <div className="flex gap-4">
        <Button>Primary Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
    </main>
  )
}
