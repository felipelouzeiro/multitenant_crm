# 🚀 Início Rápido - MultiTenant CRM

## Execução Rápida com Docker

### 1. Pré-requisitos
- Docker Desktop instalado e rodando
- Docker Compose disponível

### 2. Executar a Aplicação

**Windows (PowerShell):**
```powershell
.\scripts\start.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

**Ou manualmente:**
```bash
# 1. Construir e iniciar containers
docker-compose up --build -d

# 2. Aguardar containers iniciarem (30-40 segundos)
# 3. Executar migrações e seed
docker-compose exec -T backend npm run migration:run
docker-compose exec -T backend npm run setup:db
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

## 👤 **Credenciais de Teste**

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

---

**Problemas?** Consulte o [README.md](README.md) para documentação completa.
