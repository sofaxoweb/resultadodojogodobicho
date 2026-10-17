# Deu no Bicho 🐯

Site estático (HTML + CSS + JS puros, sem build) com o **resultado do jogo do bicho de hoje** — e o **de ontem**.

**Páginas:** `index.html` (hoje) · `ontem.html` (ontem) · `loterias.html` (Loterias Caixa) · `consultar.html` (consulta de milhar + tabela dos 25 bichos)

**Bancas (20):** Rio de Janeiro · São Paulo · Minas Gerais · Ceará · Goiás · Paraná · Rio Grande do Sul · Bahia · Bahia Paratodos · Pernambuco (Agreste) · AVAL · Paraíba (Lotep) · Campina Grande · Giro Paraíba · Brasília (LBR) · Boa Sorte Goiás · ABAESE · Loteria dos Sonhos · Popular Recife · Loteria Federal

**Loterias Caixa (9):** Mega-Sena · Lotofácil · Quina · Lotomania · Timemania · Dupla Sena · Dia de Sorte · +Milionária · Loteria Federal (via API oficial da Caixa)

## Atualização automática 🤖

O GitHub Actions roda o scraper a cada 30 minutos (`.github/workflows/scrape.yml`):

- **Fontes:** `deunoposte.com.br` (primária) × `bicholoterias.com.br` (verificação)
- **Verificação cruzada:** só publica quando as duas fontes concordam (comparação por conjunto — a fonte B às vezes ordena as milhares); a ordem 1º–10º publicada é sempre a da fonte primária
- **Guarda de conflitos:** divergência entre fontes ou com o já publicado **não** é publicada — abre um issue de alerta no repo para revisão manual
- **Virada de dia:** copia `data.js` → `data-ontem.js` automaticamente
- Só preenche sorteios vazios (`prizes: null`); nunca sobrescreve resultado publicado

Rodar manualmente: `node tools/scraper/run.js --dry` (testa sem escrever) · `node tools/scraper/test.js` (28 testes)

## Atualizar manualmente

Edite **apenas** `assets/data.js`:

1. Troque `date` pela data (`"2026-10-18"`).
2. Em cada sorteio, troque `prizes: null` pelas milhares do 1º ao 10º (ou 1º ao 5º), sempre com 4 dígitos: `["6897","7135",…]`.
3. **Grupo e bicho são calculados automaticamente.** Sorteios futuros ficam com `prizes: null` (contagem regressiva automática).

Rotina ao virar o dia: copie `data.js` → `data-ontem.js`, depois preencha `data.js` com o novo dia.

## Testes

```bash
node tools/test.js
```

## Publicar

100% estático — este repositório pode ser servido direto (ex.: GitHub Pages ou sincronização com a hospedagem a partir da raiz).
