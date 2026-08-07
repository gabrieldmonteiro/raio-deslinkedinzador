/** Hero brand block for the home page (product name + one-line pitch). */

export function Header() {
  return (
    <header className="header">
      <h1 className="title">
        <span className="title-bolt" aria-hidden="true">
          ⚡
        </span>{" "}
        Raio DesLinkedinzador
      </h1>
      <p className="subtitle">
        Transforme textões do LinkedIn em textos que um ser humano realmente
        leria.
      </p>
    </header>
  );
}
