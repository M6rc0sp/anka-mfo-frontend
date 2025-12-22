# Frontend - Anka MFO Platform

Cliente Next.js para plataforma Multi Family Office.

## 🚀 Quick Start

### Com Docker

```bash
# Clone infra com submodules
git clone --recurse-submodules https://github.com/m6rc0sp/anka-mfo-infra.git
cd anka-mfo-infra

# Suba os serviços
docker compose up -d

# Acesse
# Frontend: http://localhost:3000
# Backend:  http://localhost:3333
```

### Local (Node.js 20+)

```bash
# Clone apenas frontend
git clone https://github.com/m6rc0sp/anka-mfo-frontend.git
cd anka-mfo-frontend

# Instale dependências
npm install

# Configure environment
cp .env.example .env

# Inicie dev server
npm run dev

# Acesse: http://localhost:3000
```

## 📦 Instalação

### Pré-requisitos
- Node.js 20+ LTS
- npm 10+
- Backend rodando (http://localhost:3333)

### Passos

```bash
git clone https://github.com/m6rc0sp/anka-mfo-frontend.git
cd anka-mfo-frontend
npm install
cp .env.example .env
npm run dev
```

## 📋 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot-reload
npm run build        # Build otimizado para produção
npm run start        # Rodar build gerado
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
```

## 🏗️ Arquitetura

**Framework:** Next.js 14 com App Router

```
src/
├── app/              # App Router (Fase 5+)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── [resource]/   # Dynamic routes
├── components/       # Componentes reutilizáveis (Fase 6)
├── hooks/           # Custom React hooks (Fase 6)
├── types/           # TypeScript types
├── utils/           # Utilities e helpers
└── styles/          # Global styles
```

## 🎨 Decisões de UX

**Fase 2:** Estrutura base apenas (sem componentes visuais)

### Futuros (Fase 5-6)

**Design System:**
- shadcn/ui components
- Tailwind CSS
- Dark mode support

**Navegação:**
- Sidebar principal
- Breadcrumbs
- Mobile responsive

**Componentes:**
- DataTable com sort/filter
- Forms com validação Zod
- Charts com Recharts
- Modals e drawers

## 📡 Integração com Backend

### Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### API Client Pattern

```typescript
// utils/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
```

## 🔒 Segurança

**Implementado (Fase 2):**
- ✅ Environment variables tipadas
- ✅ CSP headers automáticos
- ✅ XSS protection padrão

**Próximo (Fase 8):**
- JWT refresh tokens
- Secure cookies
- RBAC UI

## 📱 Responsividade

- Mobile-first approach
- Tailwind breakpoints: sm, md, lg, xl
- Touch-friendly interactions

## 🚀 Performance

- Code splitting automático
- Image optimization
- Font subsetting
- Lazy loading de componentes

## 🎯 Estrutura de Pastas Explicada

```
src/
├── app/
│   ├── layout.tsx          # Root layout (meta, fonts, providers)
│   ├── page.tsx            # Home page
│   └── clients/
│       ├── page.tsx        # Lista de clientes
│       └── [id]/
│           └── page.tsx    # Detalhe do cliente
│
├── components/
│   ├── common/             # Shared (Header, Footer, Sidebar)
│   ├── clients/            # Client-specific
│   └── ui/                 # Base components (Button, Input, etc)
│
├── hooks/                  # useAPI, useForm, etc
├── types/                  # TS interfaces globais
├── utils/                  # API client, formatters, etc
└── styles/                 # Global CSS, Tailwind config
```

## 🔄 Integração com API Backend

### Exemplo: Listar Clientes

```typescript
// app/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(r => r.json())
      .then(data => setClients(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  
  return (
    <div>
      <h1>Clientes</h1>
      {clients.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
}
```

## 🧪 Testing (Futuro)

```bash
npm test  # Jest + React Testing Library (Fase 7+)
```

## 🌐 Build & Deploy

### Build Local

```bash
npm run build
npm run start
```

### Com Docker

```bash
# Já incluído em docker-compose.yml
docker compose up -d

# Ou build manual
docker build -t anka-frontend:latest .
docker run -p 3000:3000 anka-frontend:latest
```

### Variáveis de Produção

```env
NEXT_PUBLIC_API_URL=https://api.producao.com
```

## 🚨 Status da Fase

**Fase 2 (Atual):** ⏳ Estrutura base pronta para Fase 5

Próximas:
- **Fase 5** (3-4h): Layout, componentes base
- **Fase 6** (8-12h): Telas principais
- **Fase 7** (4-6h): Integração full-stack

## 📚 Stack Técnico

| Pacote | Versão | Uso |
|--------|--------|-----|
| Next.js | 14 | Framework |
| React | 18 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Tailwind CSS | 3 | Styling |
| shadcn/ui | Latest | Components |
| Recharts | Latest | Gráficos |

## 🤝 Contributing

```bash
git checkout -b feature/sua-feature
npm run build  # Verificar
git commit -m "feat: descrição"
git push
```

---

**Status:** ⏳ Fase 2 (Aguarda Fase 5) | **v1.0.0** | Dezembro 2025
