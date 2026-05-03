import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as React from "react";

// Shim motion — we only assert copy, not motion behavior.
vi.mock("motion/react", () => {
  const pass = (tag: string) => (props: Record<string, unknown>) => {
    const rest: Record<string, unknown> = { ...props };
    for (const key of [
      "initial",
      "animate",
      "whileInView",
      "viewport",
      "transition",
      "exit",
      "style",
    ]) {
      delete rest[key];
    }
    return React.createElement(tag, rest, (props as { children?: React.ReactNode }).children);
  };
  return {
    motion: new Proxy(
      {},
      {
        get: (_t, tag: string) => pass(tag),
      },
    ),
    useReducedMotion: () => true,
    useInView: () => false,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useMotionValue: () => ({ set: () => {}, get: () => 0 }),
    useSpring: () => ({ set: () => {}, get: () => 0 }),
  };
});

// lucide-react is unmocked — real SVGs render fine in jsdom.

import HomePage from "@/app/(marketing)/page";

describe("home page — copy + 4-verb IA", () => {
  afterEach(() => cleanup());

  it("lands the three core taglines", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /codebase knowledge/i })).toBeTruthy();
    expect(screen.getByText(/build the context your codebase never had/i)).toBeTruthy();
    expect(screen.getByText(/knowledge is better when it.?s contextual/i)).toBeTruthy();
  });

  it("shows the 4-verb product map with user-facing module names", () => {
    render(<HomePage />);
    expect(screen.getAllByText(/how you use it/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/sources/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/knowledge/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/chatbot/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/generate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/wiki/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/intelligence/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/docsgen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/omniboard/i).length).toBeGreaterThan(0);
  });
});
