# 🔧 Troubleshooting - MultiTenant CRM

## Problemas Comuns e Soluções

### ❌ **Docker não encontrado**
```
❌ Docker não encontrado. Instale o Docker Desktop primeiro.
```

**Solução:**
1. Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Inicie o Docker Desktop
3. Aguarde até aparecer "Docker Desktop is running"
4. Execute o script novamente

### ❌ **Porta já em uso**
```
Error: Port 3000 is already in use
Error: Port 3001 is already in use
```

**Solução:**
```bash
# Parar containers existentes
docker-compose down

# Verificar se há processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar processo se necessário (substitua PID pelo número do processo)
taskkill /PID <PID> /F
```

### ❌ **Erro de build**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /app/package.json
```

**Solução:**
```bash
# Limpar cache do Docker
docker system prune -a

# Reconstruir sem cache
docker-compose build --no-cache

# Executar novamente
docker-compose up -d
```

### ❌ **Banco de dados não conecta**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução:**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Se não estiver, reiniciar
docker-compose restart postgres

# Aguardar e executar seed
docker-compose exec backend npm run reset:db
```

### ❌ **Login não funciona**
```
{"message":"Credenciais inválidas","error":"Unauthorized","statusCode":401}
```

**Solução:**
```bash
# Executar seed do banco
docker-compose exec backend npm run reset:db

# Verificar se os usuários foram criados
docker-compose exec postgres psql -U postgres -d multitenant_crm -c "SELECT email, role FROM users;"
```

### ❌ **Frontend não carrega**
```
This site can't be reached
```

**Solução:**
```bash
# Verificar logs do frontend
docker-compose logs frontend

# Reiniciar frontend
docker-compose restart frontend

# Verificar se o backend está rodando
docker-compose logs backend
```

## 🔍 **Comandos de Diagnóstico**

### **Verificar status dos containers**
```bash
docker-compose ps
```

### **Ver logs em tempo real**
```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### **Verificar conectividade do banco**
```bash
docker-compose exec postgres psql -U postgres -d multitenant_crm -c "\dt"
```

### **Testar API do backend**
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET

# Linux/Mac
curl http://localhost:3001/health
```

### **Limpar tudo e recomeçar**
```bash
# Parar e remover tudo
docker-compose down -v
docker system prune -a -f

# Reconstruir do zero
docker-compose up --build -d
```

## 📋 **Checklist de Verificação**

- [ ] Docker Desktop está rodando
- [ ] Portas 3000 e 3001 estão livres
- [ ] Containers estão rodando (`docker-compose ps`)
- [ ] Banco de dados está acessível
- [ ] Seed foi executado com sucesso
- [ ] Frontend responde em http://localhost:3000
- [ ] Backend responde em http://localhost:3001

## 🆘 **Ainda com problemas?**

1. **Verifique os logs completos:**
   ```bash
   docker-compose logs > logs.txt
   ```

2. **Teste com usuários diferentes:**
   - admin@acme.com / admin123
   - admin@globex.com / admin123
   - admin@initech.com / admin123

3. **Verifique se não há conflitos de rede:**
   ```bash
   docker network ls
   docker network prune
   ```

4. **Reinicie o Docker Desktop** e tente novamente
