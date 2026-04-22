import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// next/navigation shim
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(""),
}));

// next-auth/react shim
const mockSignIn = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// next/image shim — avoid Next's image optimizer in tests
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props as { src: string; alt: string };
    // biome-ignore lint/performance/noImgElement: test shim replacing next/image
    return <img src={src} alt={alt} {...rest} />;
  },
}));

import LoginPage from "@/app/(auth)/login/page";

describe("LoginPage", () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockPush.mockReset();
    mockRefresh.mockReset();
  });

  afterEach(() => cleanup());

  it("renders the form and logo", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /sign in to the playground/i })).toBeTruthy();
    expect(screen.getByLabelText(/persona/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy();
    expect(screen.getByAltText(/context layer/i)).toBeTruthy();
  });

  it("submits credentials via signIn and pushes to callbackUrl on success", async () => {
    mockSignIn.mockResolvedValueOnce({ error: undefined });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/persona/i), { target: { value: "full" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "letmein" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        username: "full",
        password: "letmein",
        redirect: false,
      });
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows a generic error when signIn fails (no leaking which field was wrong)", async () => {
    mockSignIn.mockResolvedValueOnce({ error: "CredentialsSignin" });
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/persona/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/don't match/i);
    expect(alert.textContent?.toLowerCase()).not.toContain("username");
    expect(alert.textContent?.toLowerCase()).not.toContain("password");
  });
});
