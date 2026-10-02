import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DecisionHelper } from "../decision-helper";

describe("DecisionHelper", () => {
  // Regression: a work truck whose cab needs cleaning is sent to Full Deluxe, but the card quotes
  // priceRange().min ("From $100", the motorcycle price) and the Book link carries no size, so the
  // truck owner sees $100 and lands in booking on "Car" instead of the $165 truck price.
  it("quotes the truck price and pre-selects size=truck for a work truck", () => {
    render(<DecisionHelper />);
    fireEvent.click(screen.getByLabelText(/Work truck/));
    fireEvent.click(screen.getByLabelText(/Grimy/));
    fireEvent.click(screen.getByLabelText(/Inside needs work/));

    expect(screen.getByRole("heading", { name: /Full Deluxe/ })).toBeInTheDocument();
    expect(screen.queryByText(/From \$100/)).not.toBeInTheDocument();
    const book = screen.getByRole("link", { name: /Book Full Deluxe/ });
    expect(book.getAttribute("href")).toContain("size=truck");
  });
});
