# 🚀 Fullstack Tech Challenge

Aplicação fullstack completa com **multitenancy**, **RBAC** e **Docker** para o desafio técnico.

## 🏗️ **Arquitetura**

- **Frontend**: NextJS 14 + TypeScript + TailwindCSS + React Query
- **Backend**: NestJS + TypeScript + TypeORM + PostgreSQL
- **Database**: PostgreSQL 15
- **Containerização**: Docker + Docker Compose
- **Autenticação**: JWT + Passport
- **Multitenancy**: Isolamento completo por tenant
- **RBAC**: ADMIN, USER, GUEST roles

## 🐳 **Docker Setup (Recomendado)**

### **Pré-requisitos**
- Docker Desktop instalado
- Docker Compose instalado

### **Setup Rápido**

#### **Windows (PowerShell)**
```powershell
.\scripts\setup-docker.ps1
```

#### **Linux/Mac (Bash)**
```bash
chmod +x scripts/setup-docker.sh
./scripts/setup-docker.sh
```

#### **Manual**
```bash
# Construir e iniciar containers
docker-compose up --build -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Acesso**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: localhost:5432

## 👤 **Usuários de Teste**

### **🏢 ACME (tenant-1)**
- **Admin**: admin@acme.com / admin123
- **User**: user@acme.com / user123
- **Guest**: guest@acme.com / guest123

### **🏢 GLOBEX (tenant-2)**
- **Admin**: admin@globex.com / admin123
- **User**: user@globex.com / user123
- **Guest**: guest@globex.com / guest123

### **🏢 INITECH (tenant-3)**
- **Admin**: admin@initech.com / admin123
- **User**: user@initech.com / user123
- **Guest**: guest@initech.com / guest123

## 🔐 **Funcionalidades**

### **Multitenancy**
- ✅ Isolamento completo de dados por tenant
- ✅ JWT com tenantId e tenantName
- ✅ Cache limpo ao trocar de tenant
- ✅ Nome da empresa no header

### **RBAC (Role-Based Access Control)**
- **ADMIN**: CRUD completo de usuários e clientes
- **USER**: CRUD clientes, visualizar usuários
- **GUEST**: Apenas visualizar clientes

### **CRUD Completo**
- ✅ Usuários (criar, editar, deletar, listar)
- ✅ Clientes (criar, editar, deletar, listar)
- ✅ Validações de formulário
- ✅ Busca e filtros
- ✅ Dashboard com KPIs

## 🛠️ **Desenvolvimento Local**

### **Backend**
```bash
cd backend
npm install
npm run start:dev
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Database**
```bash
# Reset do banco
cd backend
npm run reset:db
```

## 📁 **Estrutura do Projeto**

```
fullstack-tech-challenge/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # CRUD Usuários
│   │   ├── clients/        # CRUD Clientes
│   │   ├── dashboard/      # KPIs
│   │   └── seed/           # Dados de teste
│   ├── Dockerfile
│   └── package.json
├── frontend/               # NextJS App
│   ├── app/               # Páginas
│   ├── components/        # Componentes React
│   ├── contexts/          # Context API
│   ├── lib/               # Utilitários
│   ├── Dockerfile
│   └── package.json
├── scripts/               # Scripts de setup
├── docker-compose.yml     # Orquestração Docker
└── README.md
```

## 🚀 **Deploy**

### **Vercel (Frontend)**
- Configurado para build standalone
- Variáveis de ambiente para API URL

### **Render (Backend)**
- PostgreSQL add-on
- Build automático do Docker

## 🔧 **Comandos Úteis**

```bash
# Docker
docker-compose up -d          # Iniciar containers
docker-compose down           # Parar containers
docker-compose restart        # Reiniciar containers
docker-compose logs -f        # Ver logs

# Backend
npm run start:dev            # Desenvolvimento
npm run build               # Build produção
npm run reset:db            # Reset banco

# Frontend
npm run dev                 # Desenvolvimento
npm run build              # Build produção
```

## 📊 **Dashboard**

- Total de clientes por tenant
- Clientes ativos por tenant
- Gráficos e estatísticas

## 🔒 **Segurança**

- ✅ JWT com expiração
- ✅ Senhas hasheadas (bcrypt)
- ✅ Validação de entrada
- ✅ Isolamento por tenant
- ✅ RBAC implementado
- ✅ CORS configurado

## 🎯 **Próximos Passos**

- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento e logs
- [ ] Backup automático
- [ ] Rate limiting
- [ ] Documentação API (Swagger)

---

**Desenvolvido com ❤️ para o desafio técnico fullstack**
