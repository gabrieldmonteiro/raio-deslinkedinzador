import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnlinkedinButton } from "./UnlinkedinButton";
import { CopyButton } from "./CopyButton";
import { ErrorMessage } from "./ErrorMessage";
import { Footer } from "./Footer";
import { SOCIAL_LINKS } from "../utils/constants";

describe("UnlinkedinButton", () => {
  it("renders the action label and respects disabled state", () => {
    render(
      <UnlinkedinButton onClick={() => undefined} disabled busy={false} />,
    );
    const button = screen.getByRole("button", { name: /DESLINKEDINZAR/i });
    expect(button).toBeDisabled();
  });

  it("shows busy label while processing", () => {
    render(
      <UnlinkedinButton onClick={() => undefined} disabled busy />,
    );
    expect(
      screen.getByRole("button", { name: /DesLinkedinzando/i }),
    ).toBeInTheDocument();
  });
});

describe("CopyButton", () => {
  it("toggles copied label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(
      <CopyButton onClick={onClick} copied={false} />,
    );

    await user.click(screen.getByRole("button", { name: /Copiar/i }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<CopyButton onClick={onClick} copied />);
    expect(
      screen.getByRole("button", { name: /Texto copiado/i }),
    ).toBeInTheDocument();
  });
});

describe("ErrorMessage", () => {
  it("renders nothing without an error", () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an accessible alert", () => {
    render(
      <ErrorMessage
        error={{ kind: "empty", message: "Cole um textão antes de chamar o raio." }}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/textão/i);
  });
});

describe("Footer", () => {
  it("links to the configured social profiles", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      SOCIAL_LINKS.linkedin,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      SOCIAL_LINKS.github,
    );
  });
});
