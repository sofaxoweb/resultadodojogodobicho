# Deu no Bicho 🐯

Site estático (HTML + CSS + JS puros, sem build) com o **resultado do jogo do bicho de hoje** — e o **de ontem**.

**Páginas:** `index.html` (hoje) · `ontem.html` (ontem) · `consultar.html` (consulta de milhar + tabela dos 25 bichos)

**Bancas:** Rio de Janeiro · São Paulo · Minas Gerais · Pernambuco (Agreste) · Paraíba (Lotep) · Brasília (LBR) · Bahia (Paratodos)

## Atualizar os resultados

Edite **apenas** `assets/data.js` (hoje) — e `assets/data-ontem.js` para o arquivo de ontem:

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
