# Calendário dos turnos (Cloudflare Worker)

Pequeno programa que corre grátis na Cloudflare. Lê o calendário dos turnos (link `.ics`/`webcal`) e devolve à app **só** datas, horas e tipo de turno — nunca os títulos nem os detalhes dos eventos. Só responde a quem enviar a chave certa.

O link do calendário e a chave ficam guardados como **segredos na Cloudflare**, nunca neste repositório (que é público).

## Como reconhece os turnos

1. Pelo título do evento: "Manhã"/"M", "Tarde"/"T", "Noite"/"N", "Folga"/"Férias" (também "Turno M", "N 24-8", etc.).
2. Se o título não disser nada, pela hora de início — mas só eventos com **6 h ou mais** (consultas e outros compromissos são ignorados):
   05–11h → manhã · 11–18h → tarde · 18–05h → noite.
3. Uma noite que começa à meia-noite conta para o dia anterior. O dia a seguir a uma noite fica como saída de noite (pode desligar-se na app).

## Instalar (uma vez)

Nesta pasta (`worker/`):

```bash
npx wrangler@4 login
```

```bash
npx wrangler@4 deploy
```

```bash
npx wrangler@4 secret put CAL_URL
```

```bash
npx wrangler@4 secret put KEY
```

- `CAL_URL`: colar o link do calendário (iCloud: calendário público · Google: endereço secreto em formato iCal).
- `KEY`: escolher uma chave comprida (ex.: quatro palavras ao calhas). É a mesma que se escreve na app em Perfil → Calendário dos turnos.

Para trocar o link ou a chave, basta repetir o `secret put` correspondente.
