/**
 * Chat prompts for WebLLM.
 * Portuguese instructions + one few-shot example steer a small model toward
 * factual short paragraphs instead of echoing LinkedIn fluff.
 */

const SYSTEM_PROMPT = `Você resume posts longos do LinkedIn em português do Brasil.

Tarefa: ler o texto inteiro e reescrever o conteúdo em UM parágrafo curto (2 a 4 frases).
O parágrafo deve cobrir o que o post diz de verdade: fatos, empresas, cargos, números, datas e resultados.
Remova storytelling, clichês, autopromoção e frases motivacionais.
Não invente nada. Não use listas. Não escreva "Resumo:". Responda só com o parágrafo.`;

const FEW_SHOT_USER = `DesLinkedinze:

Hoje quero compartilhar com vocês uma reflexão sobre uma jornada que começou há alguns meses. Saí da zona de conforto, enfrentei desafios que me fizeram crescer e, com muita gratidão, tenho a felicidade de anunciar que estou iniciando um novo ciclo como Engenheiro de Software na Empresa Aurora, onde vou atuar com React e TypeScript.`;

const FEW_SHOT_ASSISTANT =
  "A pessoa começou como Engenheira(o) de Software na Empresa Aurora, atuando com React e TypeScript.";

/** Build the chat.completions message list for one user post. */
export function buildMessages(
  text: string,
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: FEW_SHOT_USER },
    { role: "assistant", content: FEW_SHOT_ASSISTANT },
    {
      role: "user",
      content: `DesLinkedinze o texto abaixo. Resuma TODO o conteúdo em um parágrafo breve:\n\n${text.trim()}`,
    },
  ];
}
