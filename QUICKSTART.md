# 🚀 Início Rápido - Fullstack Tech Challenge

## Execução Rápida com Docker

### 1. Pré-requisitos
- Docker Desktop instalado e rodando
- Docker Compose disponível

### 2. Executar a Aplicação

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Ou manualmente:**
```bash
docker-compose up --build -d
```

### 3. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api

### 4. Fazer Login

Use um dos usuários de teste:

| Email | Senha | Role | Permissões |
|-------|-------|------|------------|
| admin@example.com | admin123 | ADMIN | Total acesso |
| user@example.com | user123 | USER | Clientes + visualizar usuários |
| guest@example.com | guest123 | GUEST | Apenas visualizar clientes |

## Comandos Úteis

```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Executar seed novamente
docker-compose exec backend npm run seed
```

## Estrutura do Projeto

```
fullstask-tech-desafio/
├── backend/                 # API NestJS
├── frontend/               # Aplicação NextJS
├── scripts/                # Scripts de setup
├── docker-compose.yml      # Desenvolvimento
├── docker-compose.prod.yml # Produção
└── README.md              # Documentação completa
```

## Funcionalidades Implementadas

✅ **Autenticação JWT** com refresh token  
✅ **RBAC** (Role-Based Access Control)  
✅ **Multitenancy** com isolamento de dados  
✅ **CRUD completo** de clientes e usuários  
✅ **Dashboard** com KPIs  
✅ **Dockerização** completa  
✅ **Compound Component Pattern** no frontend  
✅ **React Query** para gerenciamento de estado  
✅ **TailwindCSS** para estilização  
✅ **Context API** para autenticação  

## Próximos Passos

1. Faça login com um dos usuários de teste
2. Explore o dashboard
3. Teste as funcionalidades de CRUD
4. Verifique as permissões por role
5. Consulte a documentação da API no Swagger

---

**Problemas?** Consulte o [README.md](README.md) para documentação completa.
