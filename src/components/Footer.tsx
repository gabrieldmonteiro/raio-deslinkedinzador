/** Site footer with LinkedIn / GitHub profile links. */

import { SOCIAL_LINKS } from "../utils/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <a
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        LinkedIn
      </a>
      <span className="site-footer-sep" aria-hidden="true">
        ·
      </span>
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
      >
        GitHub
      </a>
    </footer>
  );
}
