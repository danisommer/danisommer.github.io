# danisommer.github.io

Portfólio pessoal publicado em <https://danisommer.github.io>. HTML, CSS e JavaScript puros, sem build e sem dependências (fora o Font Awesome via CDN).

Todo o conteúdo — textos, experiências, habilidades, projetos e contatos — fica em arquivos JSON na pasta `data/`, com português e inglês lado a lado. O HTML é só o esqueleto; o JavaScript lê os JSON e monta a página. O currículo em PDF sai dos mesmos arquivos (ver [Currículo em PDF](#currículo-em-pdf)).

## Rodar localmente

O site carrega os JSON com `fetch`, que não funciona abrindo o `index.html` direto no navegador (`file://`). Sirva a pasta com um servidor estático:

- **VS Code:** extensão *Live Server* → botão **Go Live**.
- **Terminal:** `python3 -m http.server 8000` na raiz do repositório e abra <http://localhost:8000>.

## Onde mudar cada coisa

| Quero mudar… | Arquivo |
|---|---|
| Nome, subtítulo, localização e texto do topo, "Sobre", foto, contatos, frase do rodapé | `data/profile.json` |
| Timeline: empregos, formação, voluntariado, cursos | `data/experience.json` |
| Carrossel de habilidades e nomes dos níveis | `data/skills.json` |
| Projetos (card + modal) e botões de filtro | `data/projects.json` |
| Textos fixos da interface: menu, botões, títulos das seções, mensagens do formulário | `data/ui.json` |
| Título da aba, descrição e imagem do preview de link (LinkedIn, WhatsApp) | `<head>` do `index.html` |
| Cores dos temas claro e escuro | `css/tokens.css` |
| Visual de uma seção | `css/sections/<seção>.css` |
| Estrutura ou comportamento de uma seção | `js/sections/<seção>.js` |
| Layout do currículo em PDF | `cv.html`, `css/cv.css`, `js/cv.js` |

## Regras do conteúdo

- **Texto que muda entre idiomas** → objeto com os dois: `{ "pt": "Olá", "en": "Hello" }`.
- **Texto igual nos dois idiomas** → string simples: `"Elixir"`.
- **Datas** → `"AAAA-MM"` (`"2025-07"`) ou só `"AAAA"` (`"2022"`). O site escreve por extenso no idioma do visitante ("julho de 2025" / "July 2025"). Sem data de fim, aparece "Presente".
- **Ordem** → a ordem dos itens no arquivo é a ordem na página. Exceção: em `data/projects.json` a ordem é de **relevância**, e na página os projetos com imagem vêm primeiro (dentro de cada grupo, vale a ordem do arquivo). Ao adicionar a foto de um projeto, ele sobe sozinho para o grupo com imagem.

### O VS Code ajuda enquanto você edita

Cada JSON aponta para um schema em `data/schemas/` (linha `"$schema"` no topo). Com isso, o VS Code:

- sublinha em vermelho campo obrigatório faltando (ex.: esqueceu o `"en"`), nome de campo errado e data em formato inválido;
- mostra o que cada campo faz ao passar o mouse;
- oferece o esqueleto de um item novo: dentro de uma lista, aperte **Ctrl+Espaço** e escolha *Novo projeto*, *Nova experiência*, *Nova habilidade*, *Nova categoria* ou *Novo contato*. **Tab** pula para o próximo campo.

## Receitas

### Adicionar um projeto

1. Salve a imagem em `images/projects/` (ex.: `meu-projeto.jpg`). Ela aparece recortada no card e inteira no modal.
2. Em `data/projects.json`, dentro de `"items"`, coloque o cursor na posição de relevância do projeto (mais relevantes no topo) e use **Ctrl+Espaço → Novo projeto**.
3. `"categories"` define em quais filtros o projeto aparece — use os `id` da lista `"categories"` no topo do arquivo.
4. `"icon"` é uma classe do [Font Awesome 6 free](https://fontawesome.com/search?ic=free), ex.: `"fas fa-music"`.
5. `"links"` aceita `"github"` e `"demo"`; os dois aparecem no card e no modal.

`icon`, `image`, `details` e `status` são opcionais. Sem imagem, o card mostra o ícone sobre fundo azul; sem `details`, o modal mostra o resumo; `"status": "in-progress"` exibe o selo "Em andamento".

### Criar um filtro novo

Adicione `{ "id": "elixir", "label": "Elixir" }` em `"categories"` no topo de `data/projects.json` e use `"elixir"` nos projetos. Filtros sem nenhum projeto ficam ocultos, então dá para deixar categorias preparadas.

### Adicionar uma experiência, formação ou curso

Em `data/experience.json`, dentro de `"items"`, use **Ctrl+Espaço → Nova experiência**. Enquanto for o emprego atual, não coloque `"end"`. `"organization"` e `"highlights"` são opcionais.

`"type"` diz em que seção do currículo o item entra: `"work"` (Experiência), `"education"` (Formação), `"volunteering"` (Voluntariado, só a linha do título) ou `"courses"` (fica só no site).

### Adicionar ou mudar uma habilidade

Em `data/skills.json`, cada item de `"categories"` é um slide do carrossel. Uma habilidade é `{ "name": "Elixir" }`. O `level` é opcional e vira uma etiqueta ao lado do nome (hoje só os idiomas usam); quando existe, precisa ser uma das chaves de `"levels"` no topo do arquivo (`basic`, `intermediate`, `advanced`, `fluent`, `professional`, `native`). Para criar um nível novo, adicione a chave em `"levels"` com o nome em pt e en.

### Virar o semestre

O semestre aparece em três textos, nos dois idiomas:

- `data/profile.json` → `intro` e o segundo item de `about.paragraphs`;
- `data/experience.json` → item da UTFPR, em `highlights`.

### Adicionar um contato ou rede social

Em `data/profile.json`, dentro de `"contacts"`, use **Ctrl+Espaço → Novo contato**. Com `"social": true`, o ícone também aparece em "Redes Sociais", no rodapé.

### Trocar a foto

`data/profile.json` → `photo.src` (a imagem vai em `images/`).

## Currículo em PDF

O botão **Baixar CV (PDF)**, na seção "Sobre", baixa o currículo no idioma em que o site está (`cv/pt.pdf` ou `cv/en.pdf`). Ninguém edita o PDF: ele é gerado a cada publicação a partir dos mesmos `data/*.json`, então atualizar o site atualiza o currículo.

O que entra, em uma página A4, uma coluna, texto selecionável (legível por sistemas de triagem/ATS):

| Seção do CV | De onde vem |
|---|---|
| Cabeçalho | `profile.json`: `name`, `headline`, `location`, `contacts` |
| Resumo | `profile.json`: `intro` (o texto do topo do site) |
| Experiência / Formação / Voluntariado | `experience.json`, pelo `type` de cada item (datas em `MM/AAAA`) |
| Projetos | os 3 primeiros de `projects.json` (ordem de relevância), com tags e links |
| Habilidades | todas as categorias de `skills.json`, uma linha cada |

O layout foi calibrado para caber em uma página; se o conteúdo crescer, o PDF continua certo, só passa para a segunda página. A quantidade de projetos é a constante `PROJECT_COUNT` em `js/cv.js`.

**Ver localmente:** com o servidor rodando, abra <http://localhost:8000/cv.html> (ou `cv.html?lang=en`). Para gerar um PDF na mão: **Ctrl+P → Salvar como PDF**, com **Cabeçalhos e rodapés** desmarcado.

**Como é gerado:** o job `deploy` roda `scripts/build-cv.sh`, que serve o site localmente, confirma que o `cv.html` renderizou e imprime cada idioma com o Chrome headless do runner do GitHub. Se o currículo não renderizar, a publicação falha e o site anterior continua no ar. A pasta `cv/` não vai para o git (está no `.gitignore`).

## Publicação

Todo push dispara o workflow `.github/workflows/pages.yml`:

1. **validate** — `scripts/validate-content.mjs` confere os JSON contra os schemas e também verifica o que o schema sozinho não pega: id de projeto repetido, categoria ou nível de habilidade que não existe e imagem que não está na pasta.
2. **deploy** — só na `main` e só se a validação passar: gera os PDFs do currículo e publica o site no GitHub Pages.

Se a validação falhar, o site no ar continua na versão anterior e o erro aparece na aba **Actions** do repositório, apontando arquivo e campo.

Para validar antes de fazer push (opcional, Node 18+):

```bash
npm install --no-save --no-package-lock ajv@8
node scripts/validate-content.mjs
```

> Pré-requisito (uma vez só): em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Com a opção antiga ("Deploy from a branch"), o GitHub também publica a branch direto, sem os PDFs do currículo, e as duas publicações concorrem.

## Estrutura do código

```
index.html            esqueleto da página; aplica o tema salvo antes da primeira pintura
cv.html               página do currículo (vira o PDF); css/cv.css e js/cv.js
data/                 conteúdo (JSON) + schemas de validação
css/tokens.css        cores, sombras, fontes e medidas (temas claro/escuro)
css/base.css          reset, tipografia, botões, títulos de seção
css/layout.css        header, menu mobile, rodapé, botão de voltar ao topo
css/sections/         um arquivo por seção
js/main.js            carrega data/*.json e monta cada seção
js/core/              idioma (i18n.js), tema, carga do conteúdo, criação de elementos (dom.js)
js/sections/          um módulo por seção: setup() liga os eventos uma vez; render() monta o HTML
                      e roda de novo quando o idioma muda
scripts/              validação do conteúdo e geração dos PDFs, usadas pelo workflow
```

Textos fixos do HTML usam `data-i18n="chave.do.ui"` (conteúdo) ou `data-i18n-aria-label="…"` (rótulo para leitores de tela), com as chaves de `data/ui.json`. Uma chave inexistente aparece na página como o próprio nome da chave e gera um aviso no console.
