# André Morais — Portfólio

Página pessoal com meus links, projetos e invenções feitas com IA.
HTML, CSS e JavaScript puros, sem build e sem dependências para instalar.

## Publicar no GitHub Pages

1. Crie um repositório público. Para o endereço ficar `https://andremoraisms.github.io`, dê ao repositório o nome `andremoraisms.github.io`.
2. Envie todos os arquivos e pastas (`index.html`, `css/`, `js/`, `assets/` e este README) para a raiz da branch `main`.
3. No repositório, abra **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**, selecione `main` e a pasta `/ (root)`, e clique em **Save**.
5. Em um ou dois minutos o site fica no ar no endereço mostrado nessa mesma tela.

Se o repositório tiver outro nome (por exemplo `portfolio`), o endereço vira `https://andremoraisms.github.io/portfolio`.

## Estrutura

```
index.html       estrutura da página
css/style.css    cores, fontes e layout
js/data.js       conteúdo (perfil, links e projetos)
js/main.js       montagem da página e animações
assets/          foto de perfil e capas dos projetos
```

## Editar o conteúdo

Todo o texto da página fica em `js/data.js`. O comentário no topo do arquivo explica cada campo.

- `profile`: nome, apresentação, frases que giram no topo, bio, local, status, foto, e-mail e botão final
- `links`: os links que aparecem no topo
- `projects`: os cards de projetos
- `updatedAt`: data mostrada no rodapé

Salve, faça o commit e o push. O GitHub Pages atualiza o site em um ou dois minutos.

Para testar antes de subir, abra o `index.html` no navegador ou use a extensão Live Server do VS Code.

Imagens ficam na pasta `assets/`, usando o caminho no `data.js`, por exemplo `image: "assets/og-studyflow.png"`. As capas dos projetos ficam melhores na proporção 1200 × 630, a mesma das imagens de compartilhamento.

O GitHub Pages diferencia maiúsculas de minúsculas, então o caminho precisa bater exatamente com o nome do arquivo.

Cores e fontes ficam nas variáveis do início de `css/style.css`.

## Tecnologias

- [GSAP](https://gsap.com) com ScrollTrigger e Flip para as animações
- [Lenis](https://lenis.darkroom.engineering) para a rolagem suave
- Fontes Bricolage Grotesque, Geist e Geist Mono (Google Fonts)
