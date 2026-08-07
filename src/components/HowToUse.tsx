/**
 * Static "Como usar" guide: Chrome/Edge, hardware acceleration, GPU flags.
 * Optional CTA returns the user to home via onGoHome from App.
 */

interface HowToUseProps {
  onGoHome?: () => void;
}

export function HowToUse({ onGoHome }: HowToUseProps) {
  return (
    <section className="panel about-panel" aria-labelledby="how-to-use-title">
      <h1 id="how-to-use-title" className="about-title">
        Como usar
      </h1>
      <p className="about-lead">
        Passo a passo para o usuário final conseguir rodar o Raio
        DesLinkedinzador no próprio computador.
      </p>

      <h2 className="about-subtitle">1. Use o navegador certo</h2>
      <ul className="about-list">
        <li>
          <strong>Recomendado:</strong> Google Chrome ou Microsoft Edge
          atualizados (versão recente).
        </li>
        <li>
          Abra o site em uma <strong>janela normal</strong> do Chrome/Edge — não
          use o preview embutido do editor (Cursor/VS Code).
        </li>
        <li>
          Firefox e Safari geralmente <strong>não</strong> funcionam bem com
          este app.
        </li>
      </ul>

      <h2 className="about-subtitle">2. Ative a aceleração de hardware</h2>
      <ol className="about-steps">
        <li>
          No Chrome, abra <code>chrome://settings/system</code> (no Edge:{" "}
          <code>edge://settings/system</code>).
        </li>
        <li>
          Ative <strong>Usar aceleração de gráficos quando disponíveis</strong>.
        </li>
        <li>Feche e reabra o navegador por completo.</li>
      </ol>

      <h2 className="about-subtitle">3. Confirme o WebGPU</h2>
      <ol className="about-steps">
        <li>
          Abra <code>chrome://gpu</code> (ou <code>edge://gpu</code>).
        </li>
        <li>
          Procure a linha <strong>WebGPU</strong>. O ideal é aparecer{" "}
          <strong>Hardware accelerated</strong>.
        </li>
        <li>
          Se estiver <em>Unavailable</em>, <em>Software only</em> ou com aviso
          de blocklist, siga o passo 4.
        </li>
      </ol>

      <h2 className="about-subtitle">4. Flags úteis (quando o WebGPU falha)</h2>
      <p>
        Aceleração de hardware ligada nem sempre libera WebGPU. Nestes casos,
        no Chrome:
      </p>
      <ol className="about-steps">
        <li>
          Abra <code>chrome://flags/#enable-unsafe-webgpu</code> →{" "}
          <strong>Enabled</strong>.
        </li>
        <li>
          Abra <code>chrome://flags/#ignore-gpu-blocklist</code> →{" "}
          <strong>Enabled</strong>.
        </li>
        <li>
          Em notebooks com GPU dedicada, tente também{" "}
          <code>chrome://flags/#force-high-performance-gpu</code> →{" "}
          <strong>Enabled</strong>.
        </li>
        <li>
          Clique em <strong>Relaunch</strong> e teste o app de novo.
        </li>
      </ol>

      <h2 className="about-subtitle">5. Notebook com GPU dedicada (Windows)</h2>
      <ol className="about-steps">
        <li>
          Vá em <strong>Configurações → Sistema → Tela → Gráficos</strong>.
        </li>
        <li>
          Adicione o executável do Chrome (<code>chrome.exe</code>) ou Edge.
        </li>
        <li>
          Escolha <strong>Alto desempenho</strong> e salve.
        </li>
        <li>Reinicie o navegador.</li>
      </ol>

      <h2 className="about-subtitle">6. Usar o app</h2>
      <ol className="about-steps">
        <li>
          Vá em <strong>Início</strong>, cole o textão do LinkedIn.
        </li>
        <li>
          Clique em <strong>DESLINKEDINZAR</strong>.
        </li>
        <li>
          Na primeira vez, aguarde o download do modelo (pode levar alguns
          minutos e usar bastante memória/VRAM).
        </li>
        <li>
          Copie o parágrafo gerado ou rode de novo com outro texto.
        </li>
      </ol>

      {onGoHome && (
        <button type="button" className="primary-button about-cta" onClick={onGoHome}>
          <span aria-hidden="true">⚡</span>
          <span>Ir para o Início</span>
        </button>
      )}

      <h2 className="about-subtitle">Problemas comuns</h2>
      <ul className="about-list">
        <li>
          <strong>“Nenhum adaptador foi encontrado”</strong> — WebGPU bloqueado
          ou sem GPU utilizável. Refaça os passos 2–5 e atualize o driver da
          GPU.
        </li>
        <li>
          <strong>Trava no carregamento</strong> — conexão lenta ou pouca
          memória; feche outras abas e tente de novo.
        </li>
        <li>
          <strong>Funciona no PC e não no celular</strong> — esperado: suporte
          móvel a WebGPU ainda é limitado.
        </li>
      </ul>

      <p className="about-note">
        Este app prioriza privacidade (IA local). Em troca, exige hardware e
        navegador compatíveis — não roda na maioria absoluta dos dispositivos.
      </p>
    </section>
  );
}
