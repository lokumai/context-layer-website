import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { FadeUp } from "@/components/motion/fade-up";
import { GlowPulse } from "@/components/motion/glow-pulse";
import { MagneticButton } from "@/components/motion/magnetic-button";
import {
  ScrollSection,
  StickyScrollGroup,
} from "@/components/motion/scroll-section";
import { TerminalType } from "@/components/motion/terminal-type";
import { PlaygroundButton } from "@/components/marketing/chrome/playground-button";

describe("motion primitives render their children without crashing", () => {
  afterEach(() => cleanup());

  it("FadeUp renders", () => {
    render(
      <FadeUp>
        <span>hello</span>
      </FadeUp>,
    );
    expect(screen.getByText("hello")).toBeTruthy();
  });

  it("GlowPulse renders", () => {
    render(
      <GlowPulse>
        <span>pulse</span>
      </GlowPulse>,
    );
    expect(screen.getByText("pulse")).toBeTruthy();
  });

  it("MagneticButton renders with href", () => {
    render(
      <MagneticButton href="/login">
        <span>magnet</span>
      </MagneticButton>,
    );
    expect(screen.getByText("magnet")).toBeTruthy();
  });

  it("TerminalType renders with reduced motion fallback", () => {
    render(<TerminalType lines={["$ ready"]} />);
    // Content is inside a pre; we just confirm the element is present.
    expect(document.querySelector("pre")).toBeTruthy();
  });

  it("ScrollSection + StickyScrollGroup render", () => {
    render(
      <StickyScrollGroup>
        <ScrollSection id="x">
          <span>section</span>
        </ScrollSection>
      </StickyScrollGroup>,
    );
    expect(screen.getByText("section")).toBeTruthy();
  });

  it("PlaygroundButton defaults to /login", () => {
    render(<PlaygroundButton />);
    expect(screen.getByTestId("playground-button").getAttribute("href")).toBe("/login");
  });
});
