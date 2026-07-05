# Landing Page — Paula Kissila Camata

Site institucional estático para a advogada Paula Kissila Camata (Direito Criminal e Trabalhista).

## Stack

HTML + CSS + JavaScript puro, sem build. Pode ser publicado em **Netlify**, **Vercel**, **GitHub Pages** ou qualquer hospedagem estática.

## Estrutura

```
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── favicon.svg
│   └── paula.jpg.svg   ← placeholder, substituir pela foto real
└── README.md
```

## Personalização — onde editar

**1. Dados de contato e identidade** → topo de `script.js`, objeto `CONFIG`:

```js
const CONFIG = {
  whatsapp: "5527000000000",          // 55 + DDD + número, só dígitos
  whatsappDisplay: "(27) 90000-0000",
  email: "contato@paulakissila.adv.br",
  oab: "OAB/ES 41.509",
  endereco: "Endereço do escritório — Cidade/ES",
  horario: "Seg a Sex · 9h às 18h",
  whatsappMsg: "Olá, Dra. Paula. Vim pelo site..."
};
```

Esses valores são injetados automaticamente nos lugares certos da página (atributos `data-oab`, `data-whatsapp-link`, etc.).

**2. Foto profissional** → substitua `assets/paula.jpg.svg` por um arquivo `paula.jpg` real (proporção 4:5 funciona melhor) e ajuste o `src` nas duas tags `<img>` de `index.html`.

**3. Formulário de contato (Web3Forms)**:
   1. Crie uma conta grátis em https://web3forms.com
   2. Gere uma access key
   3. Em `index.html`, substitua `COLE_SUA_CHAVE_WEB3FORMS_AQUI` pela chave gerada
   4. Pronto — submissões chegam no e-mail cadastrado no Web3Forms

   Enquanto a chave não estiver configurada, o formulário **automaticamente abre o WhatsApp** com os dados preenchidos (fallback). Nada quebra.

**4. Textos** → edite diretamente `index.html`. Cada seção está claramente identificada por comentários.

## Como rodar localmente

Basta abrir `index.html` no navegador. Para evitar problemas com `file://`, recomenda-se um servidor local:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

E acessar `http://localhost:8000`.

## Deploy

- **Netlify**: arraste a pasta no painel ou conecte o repositório
- **Vercel**: `vercel` na raiz, ou conecte o repositório
- **GitHub Pages**: ative Pages apontando para a branch `main`

## Conformidade OAB

O conteúdo segue o **Provimento 205/2021** do Conselho Federal da OAB:
- Caráter informativo, não publicitário-mercantil
- Sem promessas de resultado, sem superlativos
- Sem valores de honorários
- Sem depoimentos de clientes
- Aviso de conformidade no rodapé

Ao adicionar novos textos, mantenha essa linha.
