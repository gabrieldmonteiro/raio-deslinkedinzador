/**
 * Static "Sobre" content: product pitch, local-LLM explanation, privacy, limits.
 * Portuguese copy for end users; no business logic.
 */

export function About() {
  return (
    <section className="panel about-panel" aria-labelledby="about-title">
      <h1 id="about-title" className="about-title">
        Sobre
      </h1>
      <p className="about-lead">
        O Raio DesLinkedinzador transforma textões do LinkedIn em um parágrafo
        breve e claro, resumindo todo o conteúdo sem a enrolação.
      </p>

      <h2 className="about-subtitle">O que ele faz</h2>
      <p>
        Remove storytelling, clichês corporativos e enrolação motivacional.
        Mantém fatos: empresa, cargo, resultados, números e datas quando
        existirem no texto. O resultado é um parágrafo curto que cobre o sentido
        geral do post.
      </p>

      <h2 className="about-subtitle">Como funciona (por baixo dos panos)</h2>
      <ol className="about-steps">
        <li>Você cola o post no campo de texto.</li>
        <li>
          Ao clicar em <strong>DESLINKEDINZAR</strong>, o app usa{" "}
          <strong>WebLLM</strong> para rodar um modelo de linguagem leve{" "}
          <strong>dentro do seu navegador</strong>, com aceleração via WebGPU.
        </li>
        <li>
          Não há backend, API de OpenAI/Gemini/Groq nem chave de API. O
          processamento é local.
        </li>
        <li>
          Na primeira vez, o modelo é baixado e pode ser cacheado pelo
          navegador; nas próximas, costuma abrir mais rápido.
        </li>
      </ol>

      <h2 className="about-subtitle">Privacidade</h2>
      <p>
        O texto colado não é enviado a servidores externos de IA, não fica em
        banco de dados e não é salvo em <code>localStorage</code>. Não há
        analytics nem trackers. Só a preferência de tema claro/escuro pode ser
        lembrada no navegador.
      </p>

      <h2 className="about-subtitle">Limitações</h2>
      <ul className="about-list">
        <li>
          Não funciona em todos os navegadores/PCs — depende de WebGPU e GPU
          disponível.
        </li>
        <li>
          Firefox e Safari em geral não são suportados de forma confiável.
        </li>
        <li>
          Máquinas sem aceleração gráfica, GPUs em blocklist, VMs e área de
          trabalho remota costumam falhar.
        </li>
        <li>
          Modelos pequenos podem errar o tom ou omitir detalhes em textos muito
          ambíguos.
        </li>
      </ul>

      <p className="about-note">
        Para configurar o navegador e conseguir usar o app, veja a aba{" "}
        <strong>Como usar</strong>.
      </p>
    </section>
  );
}
