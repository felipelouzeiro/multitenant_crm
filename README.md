# Fullstack Tech Challenge

Aplicação fullstack desenvolvida com NextJS (frontend) e NestJS (backend), implementando autenticação JWT, RBAC (Role-Based Access Control), multitenancy e CRUD completo de clientes.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **Swagger** - Documentação da API

### Frontend
- **NextJS 14** - Framework React
- **TypeScript** - Linguagem de programação
- **TailwindCSS** - Framework CSS
- **React Query** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Lucide React** - Ícones
- **Compound Component Pattern** - Padrão de componentes

## 🏗️ Arquitetura

### Multitenancy
- Cada tenant é identificado por um `tenantId`
- Isolamento completo de dados por tenant
- `tenantId` presente no token JWT

### RBAC (Role-Based Access Control)
- **ADMIN**: Pode cadastrar, editar e visualizar todos os usuários e clientes
- **USER**: Pode cadastrar, editar e visualizar clientes, e apenas visualizar usuários
- **GUEST**: Pode apenas visualizar a lista de clientes

### Estrutura do Projeto
```
fullstask-tech-desafio/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Autenticação e autorização
│   │   ├── users/          # Gestão de usuários
│   │   ├── clients/        # Gestão de clientes
│   │   ├── dashboard/      # Estatísticas
│   │   └── seed/           # Dados iniciais
│   └── Dockerfile
├── frontend/               # Aplicação NextJS
│   ├── app/               # Páginas e rotas
│   ├── components/        # Componentes React
│   ├── contexts/          # Context API
│   ├── lib/               # Utilitários e configurações
│   └── Dockerfile
└── docker-compose.yml     # Orquestração dos containers
```

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)

### Execução com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd fullstask-tech-desafio
```

2. Execute com Docker Compose:
```bash
docker-compose up --build
```

3. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api

### Execução Local

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👤 Usuários de Teste

Após executar o projeto, você pode fazer login com os seguintes usuários:

| Email | Senha | Role | Permissões |
|-------|-------|------|------------|
| admin@example.com | admin123 | ADMIN | Total acesso |
| user@example.com | user123 | USER | Clientes + visualizar usuários |
| guest@example.com | guest123 | GUEST | Apenas visualizar clientes |

## 📋 Funcionalidades

### Autenticação
- ✅ Login com email e senha
- ✅ JWT com refresh token
- ✅ Proteção de rotas
- ✅ Interceptor para renovação automática de token

### Dashboard
- ✅ Total de clientes registrados
- ✅ Total de clientes ativos
- ✅ Interface responsiva

### Gestão de Clientes (CRUD)
- ✅ Listagem com paginação
- ✅ Criação de novos clientes
- ✅ Edição de clientes existentes
- ✅ Exclusão de clientes
- ✅ Visualização detalhada

### Gestão de Usuários (CRUD)
- ✅ Listagem de usuários (ADMIN)
- ✅ Criação de usuários (ADMIN)
- ✅ Edição de usuários (ADMIN)
- ✅ Exclusão de usuários (ADMIN)

### Multitenancy
- ✅ Isolamento de dados por tenant
- ✅ Tenant ID no token JWT
- ✅ Filtros automáticos por tenant

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=fullstack_challenge
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 API Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token
- `GET /auth/profile` - Perfil do usuário

### Usuários
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário (ADMIN)
- `GET /users/:id` - Obter usuário
- `PATCH /users/:id` - Atualizar usuário (ADMIN)
- `DELETE /users/:id` - Remover usuário (ADMIN)

### Clientes
- `GET /clients` - Listar clientes
- `POST /clients` - Criar cliente (ADMIN/USER)
- `GET /clients/:id` - Obter cliente
- `PATCH /clients/:id` - Atualizar cliente (ADMIN/USER)
- `DELETE /clients/:id` - Remover cliente (ADMIN/USER)

### Dashboard
- `GET /dashboard/stats` - Estatísticas

## 🧪 Testes

Para executar os testes:

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📦 Deploy

### Produção
```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml up --build

# Ou com variáveis de ambiente customizadas
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como parte do desafio técnico fullstack.

---

**Nota**: Esta aplicação foi desenvolvida seguindo as melhores práticas de desenvolvimento, incluindo organização de código limpa, padrões de design, e arquitetura escalável.
