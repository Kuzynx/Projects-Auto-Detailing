import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Regression: the mobile menu must release the page scroll lock on route change and return
// focus to the toggle on Escape.

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

import { MobileMenu } from "../mobile-menu";

beforeEach(() => {
  pathname = "/";
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.style.overflow = "";
});

async function flushFrames() {
  await act(async () => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  });
}

describe("MobileMenu", () => {
  it("locks scroll while open and releases it when the route changes", () => {
    const { rerender } = render(<MobileMenu />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.documentElement.style.overflow).toBe("hidden");

    pathname = "/services";
    rerender(<MobileMenu />);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    render(<MobileMenu />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    await flushFrames();
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    await flushFrames();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});

describe("MobileMenu page isolation", () => {
  let changeListeners: Array<() => void> = [];
  let desktopMatches = false;

  beforeEach(() => {
    changeListeners = [];
    desktopMatches = false;
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          get matches() {
            return desktopMatches;
          },
          media: query,
          addEventListener: (_: string, cb: () => void) => changeListeners.push(cb),
          removeEventListener: (_: string, cb: () => void) => {
            changeListeners = changeListeners.filter((l) => l !== cb);
          },
        }) as unknown as MediaQueryList,
    );
    document.body.innerHTML = `
      <nav aria-label="Primary"><a href="/services">Services</a></nav>
      <main id="main" tabindex="-1"></main>
      <footer></footer>
      <nav aria-label="Quick actions"></nav>`;
  });

  it("makes main, footer and the CTA bar inert while open and restores them on close", async () => {
    render(<MobileMenu />);
    const main = document.querySelector("main")!;
    const footer = document.querySelector("footer")!;
    const cta = document.querySelector('nav[aria-label="Quick actions"]')!;
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await flushFrames();
    for (const el of [main, footer, cta]) expect(el).toHaveAttribute("inert");
    expect(screen.getByRole("dialog")).not.toHaveAttribute("inert");

    fireEvent.keyDown(document, { key: "Escape" });
    await flushFrames();
    for (const el of [main, footer, cta]) expect(el).not.toHaveAttribute("inert");
  });

  it("moves focus to the desktop nav when it auto-closes on widening", async () => {
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await flushFrames();

    desktopMatches = true;
    act(() => changeListeners.forEach((l) => l()));
    await flushFrames();
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("link", { name: "Services" })).toHaveFocus();
  });
});
