# danisommer.github.io

Portfólio pessoal publicado em <https://danisommer.github.io>. HTML, CSS e JavaScript puros, sem build e sem dependências (fora as fontes Schibsted Grotesk e IBM Plex Mono, do Google Fonts, e os ícones do Font Awesome via CDN).

O visual segue um grid de 12 colunas: nas seções, as 3 primeiras colunas guardam os metadados (número da seção, datas, empresa, rótulos) e as 9 restantes, o conteúdo. O tema escuro é o padrão; o claro fica a um clique e a escolha é lembrada.

Todo o conteúdo — textos, experiências, habilidades, projetos e contatos — fica em arquivos JSON na pasta `data/`, com português e inglês lado a lado. O HTML é só o esqueleto; o JavaScript lê os JSON e monta a página. O currículo em PDF sai dos mesmos arquivos (ver [Currículo em PDF](#currículo-em-pdf)).

## Rodar localmente

O site carrega os JSON com `fetch`, que não funciona abrindo o `index.html` direto no navegador (`file://`). Sirva a pasta com um servidor estático:

- **VS Code:** extensão *Live Server* → botão **Go Live**.
- **Terminal:** `python3 -m http.server 8000` na raiz do repositório e abra <http://localhost:8000>.

## Onde mudar cada coisa

| Quero mudar… | Arquivo |
|---|---|
| Nome, linha de cima, texto, lista "Experiência com" e retrato do topo, "Sobre", contatos, frase do rodapé | `data/profile.json` |
| Experiência, empresa júnior, formação, voluntariado, cursos | `data/experience.json` |
| Competências (uma linha por categoria) e nomes dos níveis | `data/skills.json` |
| Projetos (destaque, índice e modal) | `data/projects.json` |
| Textos fixos da interface: menu, botões, títulos das seções, mensagens do formulário | `data/ui.json` |
| Título da aba, descrição e imagem do preview de link (LinkedIn, WhatsApp) | `<head>` do `index.html` |
| Ícone da aba | `images/favicon.svg` (a marca "D/", com as letras em Schibsted Grotesk convertidas em contorno); `images/favicon.png` (48 px) e `images/apple-touch-icon.png` (180 px) são versões em PNG dela, para navegadores sem SVG e para a tela inicial do iPhone |
| Cores dos temas claro e escuro (e do topo, que é sempre preto) | `css/tokens.css` |
| Fundo animado de pontos (site inteiro): espaçamento, tamanho e brilho dos pontos no topo e no resto da página, raio do cursor, tamanho, frequência e duração dos "toques", frequência, profundidade, ritmo e preferência pela borda das pulsações, que só apagam um pouco o ponto (`pulse` e `PULSE`) | constantes no início de `js/core/dot-field.js` |
| Visual de uma seção | `css/sections/<seção>.css` |
| Estrutura ou comportamento de uma seção | `js/sections/<seção>.js` |
| Layout do currículo em PDF | `cv.html`, `css/cv.css`, `js/cv.js` |
| E-mail que recebe as mensagens do formulário, remetente e endereço do site aceito | `[vars]` de `worker/wrangler.toml` (vale depois do `npx wrangler deploy`, ver [Formulário de contato](#formulário-de-contato)) |

## Regras do conteúdo

- **Texto que muda entre idiomas** → objeto com os dois: `{ "pt": "Olá", "en": "Hello" }`.
- **Texto igual nos dois idiomas** → string simples: `"Elixir"`.
- **Datas** → `"AAAA-MM"` (`"2025-07"`) ou só `"AAAA"` (`"2022"`). O site e o currículo mostram `07/2025`. Sem data de fim, aparece "Presente".
- **Ordem** → a ordem dos itens no arquivo é a ordem na página, e o primeiro tem destaque: o primeiro `"work"` de `data/experience.json` sai com o primeiro tópico em corpo grande e os demais numerados em duas colunas; o primeiro projeto de `data/projects.json` sai com imagem e ficha técnica, e os outros formam o índice.
- **Topo** → os blocos "Agora", "Antes" e "Formação" saem de `data/experience.json` (o item atual de `"work"` ou `"junior-enterprise"`, o primeiro `"work"` encerrado e a formação); "Base" sai de `location`.

### O VS Code ajuda enquanto você edita

Cada JSON aponta para um schema em `data/schemas/` (linha `"$schema"` no topo). Com isso, o VS Code:

- sublinha em vermelho campo obrigatório faltando (ex.: esqueceu o `"en"`), nome de campo errado e data em formato inválido;
- mostra o que cada campo faz ao passar o mouse;
- oferece o esqueleto de um item novo: dentro de uma lista, aperte **Ctrl+Espaço** e escolha *Novo projeto*, *Nova experiência*, *Nova habilidade*, *Nova categoria* ou *Novo contato*. **Tab** pula para o próximo campo.

## Receitas

### Adicionar um projeto

1. Em `data/projects.json`, dentro de `"items"`, coloque o cursor na posição de relevância do projeto (mais relevantes no topo) e use **Ctrl+Espaço → Novo projeto**.
2. `"links"` aceita `"github"` e `"demo"`; os dois aparecem no índice, no destaque e no modal.
3. Se tiver uma imagem real do projeto (diagrama ou tela), salve em `images/projects/` e aponte em `"image"`. Ela aparece inteira no destaque e no modal, e recortada em quadrado (pelo centro) na miniatura do índice. Sem imagem, a miniatura mostra o ícone de `"icon"`, uma classe do [Font Awesome 6 free](https://fontawesome.com/search?ic=free), ex.: `"fas fa-music"` (padrão: `"fas fa-code"`).

`image`, `icon`, `details` e `status` são opcionais. Sem `details`, o modal mostra o resumo; `"status": "in-progress"` exibe "Em andamento" no destaque, abaixo do resumo no índice e no modal.

### Adicionar uma experiência, formação ou curso

Em `data/experience.json`, dentro de `"items"`, use **Ctrl+Espaço → Nova experiência**. Enquanto for o emprego atual, não coloque `"end"`. `"organization"`, `"highlights"`, `"note"` (linha curta abaixo da empresa, ex.: "15 meses · meio período") e `"stack"` (tecnologias abaixo dos tópicos) são opcionais; `note` e `stack` só aparecem no site.

`"type"` classifica o item: `"work"` entra em Experiência no site e no currículo; `"junior-enterprise"` e `"education"` entram no bloco "Empresa júnior e formação" do site (e em Empresa Júnior e Formação no currículo); `"volunteering"` e `"courses"` entram no bloco "Voluntariado e cursos" e ficam só no site.

### Adicionar ou mudar uma habilidade

Em `data/skills.json`, cada item de `"categories"` é uma linha da seção Competências (e do currículo). Uma habilidade é `{ "name": "Elixir" }`. O `level` é opcional e vira uma etiqueta ao lado do nome (hoje só os idiomas usam); quando existe, precisa ser uma das chaves de `"levels"` no topo do arquivo (`basic`, `intermediate`, `advanced`, `fluent`, `professional`, `native`). Para criar um nível novo, adicione a chave em `"levels"` com o nome em pt e en.

### Virar o semestre

O semestre aparece em três textos, nos dois idiomas:

- `data/profile.json` → `intro` e o item de `about.paragraphs` que fala da UTFPR;
- `data/experience.json` → item da UTFPR, em `highlights`.

### Adicionar um contato ou rede social

Em `data/profile.json`, dentro de `"contacts"`, use **Ctrl+Espaço → Novo contato**. Todos os contatos entram no cabeçalho do currículo; com `"featured": true`, o contato também aparece no topo, na seção Contato e no rodapé. O e-mail (`mailto:`) aparece pelo endereço; os demais, pelo nome, abrindo em nova aba.

### Trocar o retrato

`data/profile.json` → `portrait.src` (a imagem vai em `images/`). O retrato aparece recortado em 4:5, com o rosto na parte de cima; uma largura de ~800 px basta, e acima disso a imagem só fica mais pesada no carregamento. A imagem do preview de link (LinkedIn, WhatsApp) é outra: fica nas tags `og:image` e `twitter:image` do `<head>` do `index.html`.

## Currículo em PDF

O botão **Currículo em PDF**, no topo e no fim da seção "Sobre", baixa o currículo no idioma em que o site está (`cv/pt.pdf` ou `cv/en.pdf`). Ninguém edita o PDF: ele é gerado a cada publicação a partir dos mesmos `data/*.json`, então atualizar o site atualiza o currículo.

O que entra, em uma página A4, uma coluna, texto selecionável (legível por sistemas de triagem/ATS):

| Seção do CV | De onde vem |
|---|---|
| Cabeçalho | `profile.json`: `name`, `headline`, `location`, `contacts` |
| Resumo | `profile.json`: `intro` (o texto do topo do site) |
| Experiência / Empresa Júnior / Formação | `experience.json`, pelo `type` de cada item (datas em `MM/AAAA`) |
| Projetos | os projetos de `projects.json` que têm `"cv"`, na ordem desse número, com tags, links e a frase de `"cvSummary"` |
| Habilidades | todas as categorias de `skills.json`, uma linha cada |

O layout foi calibrado para caber em uma página com 6 projetos; se o conteúdo crescer, o PDF continua certo, só passa para a segunda página.

**Escolher os projetos do currículo:** em `data/projects.json`, `"cv": 1` põe o projeto em primeiro no currículo, `"cv": 2` em segundo, e assim por diante; sem `"cv"`, ele fica só no site. Essa ordem é independente da ordem do site. Cada projeto do currículo ocupa duas linhas: título com tecnologias e links, e a frase de `"cvSummary"` (até ~105 caracteres; sem ela, entra o `"summary"`, que ocupa mais espaço). O validador acusa duas posições `"cv"` iguais.

**Ver localmente:** com o servidor rodando, abra <http://localhost:8000/cv.html> (ou `cv.html?lang=en`). Para gerar um PDF na mão: **Ctrl+P → Salvar como PDF**, com **Cabeçalhos e rodapés** desmarcado.

**Como é gerado:** o job `deploy` roda `scripts/build-cv.sh`, que serve o site localmente, confirma que o `cv.html` renderizou e imprime cada idioma com o Chrome headless do runner do GitHub. Se o currículo não renderizar, a publicação falha e o site anterior continua no ar. A pasta `cv/` não vai para o git (está no `.gitignore`).

## Publicação

Todo push dispara o workflow `.github/workflows/pages.yml`:

1. **validate** — `scripts/validate-content.mjs` confere os JSON contra os schemas e também verifica o que o schema sozinho não pega: id de projeto repetido, posição `"cv"` repetida, nível de habilidade que não existe e imagem que não está na pasta.
2. **deploy** — só na `main` e só se a validação passar: gera os PDFs do currículo e publica o site no GitHub Pages.

Se a validação falhar, o site no ar continua na versão anterior e o erro aparece na aba **Actions** do repositório, apontando arquivo e campo.

Para validar antes de fazer push (opcional, Node 18+):

```bash
npm install --no-save --no-package-lock ajv@8
node scripts/validate-content.mjs
```

> Pré-requisito (uma vez só): em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Com a opção antiga ("Deploy from a branch"), o GitHub também publica a branch direto, sem os PDFs do currículo, e as duas publicações concorrem.

## Formulário de contato

O formulário da seção Contato não envia e-mail pelo navegador: ele manda os campos para um Cloudflare Worker (pasta `worker/`), que guarda a chave do [Resend](https://resend.com) em segredo e envia a mensagem para o e-mail de `CONTACT_TO`. O "Responder" do e-mail já vai para quem escreveu.

O Worker só aceita envios vindos de `ALLOWED_ORIGIN` (o endereço do site), confere os campos e descarta quem preenche o campo escondido `_gotcha`, que só robôs enxergam. Se o Resend recusar, o site mostra a mensagem de erro de `data/ui.json`; nada some sem aviso.

O push não publica o Worker. O deploy é manual, de dentro de `worker/`, com Node 22 ou mais novo (exigência do Wrangler):

```bash
npx wrangler login                        # uma vez só
npx wrangler secret put RESEND_API_KEY    # uma vez, e de novo ao trocar a chave
npx wrangler deploy                       # a cada mudança em worker/
```

O endereço que o `deploy` imprime (`https://portfolio-contact.<sua-conta>.workers.dev`) é o `action` do `<form id="contact-form">` no `index.html`.

Sem domínio próprio verificado no Resend, o remetente é `onboarding@resend.dev` e o destino só pode ser o e-mail da conta do Resend. Para saber o que aconteceu com um envio: logs do Worker no painel da Cloudflare (**Workers & Pages → portfolio-contact → Logs**) e a lista de e-mails no painel do Resend.

## Estrutura do código

```
index.html            esqueleto da página; aplica o tema salvo (ou o escuro) antes da primeira pintura
cv.html               página do currículo (vira o PDF); css/cv.css e js/cv.js
data/                 conteúdo (JSON) + schemas de validação
css/tokens.css        cores, fontes e medidas (tema escuro padrão e tema claro)
css/base.css          reset, grid de 12 colunas, tipografia, links, botão, cabeçalho de seção
css/layout.css        header, menu mobile, rodapé
css/sections/         um arquivo por seção
js/main.js            carrega data/*.json e monta cada seção
js/core/              idioma (i18n.js), tema, carga do conteúdo, criação de elementos (dom.js),
                      links compartilhados: currículo e contatos (links.js), fundo de pontos (dot-field.js)
js/sections/          um módulo por seção: setup() liga os eventos uma vez; render() monta o HTML
                      e roda de novo quando o idioma muda
scripts/              validação do conteúdo e geração dos PDFs, usadas pelo workflow
worker/               Cloudflare Worker do formulário de contato (envia pelo Resend); deploy à parte
```

Textos fixos do HTML usam `data-i18n="chave.do.ui"` (conteúdo) ou `data-i18n-aria-label="…"` (rótulo para leitores de tela), com as chaves de `data/ui.json`. Uma chave inexistente aparece na página como o próprio nome da chave e gera um aviso no console.
