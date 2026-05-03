import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Navbar } from "@context-layer/ui/components/marketing/chrome/navbar";

describe("Marketing Navbar", () => {
  afterEach(() => cleanup());

  it("renders the logo and product links", () => {
    render(<Navbar />);
    expect(screen.getByAltText(/context layer/i)).toBeTruthy();
    expect(screen.getAllByText(/context layer/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/code translation/i)).toBeTruthy();
    expect(screen.getByText(/code modernization/i)).toBeTruthy();
  });

  it("includes a Playground button that routes to /workspaces", () => {
    render(<Navbar />);
    const buttons = screen.getAllByTestId("playground-button");
    expect(buttons.length).toBeGreaterThan(0);
    for (const b of buttons) expect(b.getAttribute("href")).toBe("/workspaces");
  });
});
