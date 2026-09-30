# danisommer.github.io

Portfólio pessoal publicado em <https://danisommer.github.io>. HTML, CSS e JavaScript puros, sem build e sem dependências (fora o Font Awesome via CDN).

Todo o conteúdo — textos, experiências, habilidades, projetos e contatos — fica em arquivos JSON na pasta `data/`, com português e inglês lado a lado. O HTML é só o esqueleto; o JavaScript lê os JSON e monta a página.

## Rodar localmente

O site carrega os JSON com `fetch`, que não funciona abrindo o `index.html` direto no navegador (`file://`). Sirva a pasta com um servidor estático:

- **VS Code:** extensão *Live Server* → botão **Go Live**.
- **Terminal:** `python3 -m http.server 8000` na raiz do repositório e abra <http://localhost:8000>.

## Onde mudar cada coisa

| Quero mudar… | Arquivo |
|---|---|
| Nome, subtítulo, localização e texto do topo, "Sobre", foto, link do currículo, contatos, frase do rodapé | `data/profile.json` |
| Timeline: empregos, formação, cursos | `data/experience.json` |
| Carrossel de habilidades e nomes dos níveis | `data/skills.json` |
| Projetos (card + modal) e botões de filtro | `data/projects.json` |
| Textos fixos da interface: menu, botões, títulos das seções, mensagens do formulário | `data/ui.json` |
| Título da aba, descrição e imagem do preview de link (LinkedIn, WhatsApp) | `<head>` do `index.html` |
| Cores dos temas claro e escuro | `css/tokens.css` |
| Visual de uma seção | `css/sections/<seção>.css` |
| Estrutura ou comportamento de uma seção | `js/sections/<seção>.js` |

## Regras do conteúdo

- **Texto que muda entre idiomas** → objeto com os dois: `{ "pt": "Olá", "en": "Hello" }`.
- **Texto igual nos dois idiomas** → string simples: `"Elixir"`.
- **Datas** → `"AAAA-MM"` (`"2025-07"`) ou só `"AAAA"` (`"2022"`). O site escreve por extenso no idioma do visitante ("julho de 2025" / "July 2025"). Sem data de fim, aparece "Presente".
- **Ordem** → a ordem dos itens no arquivo é a ordem na página.

### O VS Code ajuda enquanto você edita

Cada JSON aponta para um schema em `data/schemas/` (linha `"$schema"` no topo). Com isso, o VS Code:

- sublinha em vermelho campo obrigatório faltando (ex.: esqueceu o `"en"`), nome de campo errado e data em formato inválido;
- mostra o que cada campo faz ao passar o mouse;
- oferece o esqueleto de um item novo: dentro de uma lista, aperte **Ctrl+Espaço** e escolha *Novo projeto*, *Nova experiência*, *Nova habilidade*, *Nova categoria* ou *Novo contato*. **Tab** pula para o próximo campo.

## Receitas

### Adicionar um projeto

1. Salve a imagem em `images/projects/` (ex.: `meu-projeto.jpg`). Ela aparece recortada no card e inteira no modal.
2. Em `data/projects.json`, dentro de `"items"`, coloque o cursor onde o projeto deve aparecer e use **Ctrl+Espaço → Novo projeto**.
3. `"categories"` define em quais filtros o projeto aparece — use os `id` da lista `"categories"` no topo do arquivo.
4. `"icon"` é uma classe do [Font Awesome 6 free](https://fontawesome.com/search?ic=free), ex.: `"fas fa-music"`.
5. `"links"` aceita `"github"` e `"demo"`; os dois aparecem no card e no modal.

`icon`, `image`, `details` e `status` são opcionais. Sem imagem, o card mostra o ícone sobre fundo azul; sem `details`, o modal mostra o resumo; `"status": "in-progress"` exibe o selo "Em andamento".

### Criar um filtro novo

Adicione `{ "id": "elixir", "label": "Elixir" }` em `"categories"` no topo de `data/projects.json` e use `"elixir"` nos projetos. Filtros sem nenhum projeto ficam ocultos, então dá para deixar categorias preparadas.

### Adicionar uma experiência, formação ou curso

Em `data/experience.json`, dentro de `"items"`, use **Ctrl+Espaço → Nova experiência**. Enquanto for o emprego atual, não coloque `"end"`. `"organization"` e `"highlights"` são opcionais.

### Adicionar ou mudar uma habilidade

Em `data/skills.json`, cada item de `"categories"` é um slide do carrossel. Uma habilidade é `{ "name": "Elixir" }`. O `level` é opcional e vira uma etiqueta ao lado do nome (hoje só os idiomas usam); quando existe, precisa ser uma das chaves de `"levels"` no topo do arquivo (`basic`, `intermediate`, `advanced`, `fluent`, `professional`, `native`). Para criar um nível novo, adicione a chave em `"levels"` com o nome em pt e en.

### Virar o semestre

O semestre aparece em três textos, nos dois idiomas:

- `data/profile.json` → `intro` e o segundo item de `about.paragraphs`;
- `data/experience.json` → item da UTFPR, em `highlights`.

### Adicionar um contato ou rede social

Em `data/profile.json`, dentro de `"contacts"`, use **Ctrl+Espaço → Novo contato**. Com `"social": true`, o ícone também aparece em "Redes Sociais", no rodapé.

### Trocar a foto ou o currículo

`data/profile.json` → `photo.src` (a imagem vai em `images/`) e `resumeUrl`.

## Publicação

Todo push dispara o workflow `.github/workflows/pages.yml`:

1. **validate** — `scripts/validate-content.mjs` confere os JSON contra os schemas e também verifica o que o schema sozinho não pega: id de projeto repetido, categoria ou nível de habilidade que não existe e imagem que não está na pasta.
2. **deploy** — só na `main` e só se a validação passar: publica o site no GitHub Pages.

Se a validação falhar, o site no ar continua na versão anterior e o erro aparece na aba **Actions** do repositório, apontando arquivo e campo.

Para validar antes de fazer push (opcional, Node 18+):

```bash
npm install --no-save --no-package-lock ajv@8
node scripts/validate-content.mjs
```

> Pré-requisito (uma vez só): em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**.

## Estrutura do código

```
index.html            esqueleto da página; aplica o tema salvo antes da primeira pintura
data/                 conteúdo (JSON) + schemas de validação
css/tokens.css        cores, sombras, fontes e medidas (temas claro/escuro)
css/base.css          reset, tipografia, botões, títulos de seção
css/layout.css        header, menu mobile, rodapé, botão de voltar ao topo
css/sections/         um arquivo por seção
js/main.js            carrega data/*.json e monta cada seção
js/core/              idioma (i18n.js), tema, carga do conteúdo, criação de elementos (dom.js)
js/sections/          um módulo por seção: setup() liga os eventos uma vez; render() monta o HTML
                      e roda de novo quando o idioma muda
scripts/              validação do conteúdo usada pelo workflow
```

Textos fixos do HTML usam `data-i18n="chave.do.ui"` (conteúdo) ou `data-i18n-aria-label="…"` (rótulo para leitores de tela), com as chaves de `data/ui.json`. Uma chave inexistente aparece na página como o próprio nome da chave e gera um aviso no console.
