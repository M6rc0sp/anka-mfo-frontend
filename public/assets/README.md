# Assets Frontend - Anka MFO

Pasta para armazenar SVGs, imagens e logo do frontend.

## Estrutura

- **`icons/`** — Ícones SVG (botões, navegação, ações)
- **`images/`** — Imagens (backgrounds, ilustrações, screenshots)
- **`logo/`** — Logo Anka em diferentes formatos (SVG, PNG, favicon)

## Como usar

### SVG (recomendado para ícones e logo)
```jsx
<img src="/assets/icons/seu-icone.svg" alt="Descrição" />
```

### Imagem
```jsx
<img src="/assets/images/sua-imagem.png" alt="Descrição" />
```

### Logo Anka
```jsx
<img src="/assets/logo/anka-logo.svg" alt="Anka" />
```

## Caminho de acesso

Todos os arquivos aqui são servidos estaticamente pelo Next.js via:
- `/assets/icons/` — Ícones
- `/assets/images/` — Imagens
- `/assets/logo/` — Logo

**Não use caminhos relativos** (ex: `../../../public/...`). Use sempre `/assets/...` nas `src` de componentes React.
