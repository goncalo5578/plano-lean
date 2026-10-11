# Plano Lean

App de plano alimentar (PWA) para Android e iPhone. Não precisa de loja de apps, servidor nem contas — são ficheiros estáticos alojados grátis no GitHub Pages. Funciona offline depois da primeira abertura, e os dados (pesos, refeições marcadas, lista de compras) ficam guardados no próprio telemóvel.

## Instalar no telemóvel

- **iPhone (Safari):** abrir o link → botão Partilhar → **Adicionar ao ecrã principal**.
- **Android (Chrome):** abrir o link → menu ⋮ → **Instalar app** (ou "Adicionar ao ecrã principal").

## Ficheiros

| Ficheiro | Para quê |
|---|---|
| `index.html`, `styles.css`, `app.js` | A app |
| `data.js` | **Alimentos, refeições e rotação semanal** — editar aqui para mudar o plano |
| `manifest.webmanifest`, `sw.js`, `icons/` | Instalação no ecrã inicial e modo offline |

## Atualizar

1. Editar os ficheiros.
2. Mudar `VERSION` em `sw.js` (ex.: `plano-lean-v3`) para os telemóveis receberem a nova versão.
3. `git commit` e `git push` — o GitHub Pages publica sozinho em ~1 minuto.
