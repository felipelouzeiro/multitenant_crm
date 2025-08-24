# 🚀 Guia de Deploy - Fullstack Tech Challenge

## 📋 **Status Atual**
- ✅ Docker funcionando localmente
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000
- ✅ PostgreSQL: localhost:5432

---

## 🌐 **Deploy no Vercel (Frontend)**

### **1. Preparação**
1. **Acesse**: https://vercel.com
2. **Faça login** com GitHub/GitLab
3. **Clique em "New Project"**

### **2. Configuração do Projeto**
- **Import Repository**: Selecione seu repositório
- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### **3. Variáveis de Ambiente**
Adicione no Vercel:
```
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

### **4. Deploy**
- Clique em **"Deploy"**
- Aguarde o build (2-3 minutos)
- URL será: `https://seu-projeto.vercel.app`

---

## 🖥️ **Deploy no Render (Backend)**

### **1. Criar Banco de Dados**
1. **Acesse**: https://render.com
2. **Faça login** com GitHub/GitLab
3. **Clique em "New +" → "PostgreSQL"**
4. **Configure**:
   - **Name**: `fullstack-postgres`
   - **Database**: `fullstack_challenge`
   - **User**: `fullstack_user`
   - **Plan**: Free

### **2. Criar Web Service**
1. **Clique em "New +" → "Web Service"**
2. **Conecte seu repositório**
3. **Configure**:
   - **Name**: `fullstack-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm run start:prod`
   - **Root Directory**: `backend`

### **3. Variáveis de Ambiente**
No Web Service, adicione:
```
NODE_ENV=production
DATABASE_HOST=(vem do PostgreSQL)
DATABASE_PORT=(vem do PostgreSQL)
DATABASE_NAME=(vem do PostgreSQL)
DATABASE_USERNAME=(vem do PostgreSQL)
DATABASE_PASSWORD=(vem do PostgreSQL)
JWT_SECRET=sua-chave-secreta-muito-segura
```

### **4. Deploy**
- Clique em **"Create Web Service"**
- Aguarde o build (5-10 minutos)
- URL será: `https://seu-backend.onrender.com`

---

## 🔧 **Configuração Final**

### **1. Atualizar Frontend**
Após o deploy do backend, atualize no Vercel:
```
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

### **2. Testar Aplicação**
1. **Acesse**: https://seu-projeto.vercel.app
2. **Faça login** com:
   - **ACME**: admin@acme.com / admin123
   - **GLOBEX**: admin@globex.com / admin123
   - **INITECH**: admin@initech.com / admin123

---

## 🐳 **Comandos Docker Locais**

### **Iniciar**
```bash
docker-compose up --build -d
```

### **Verificar Status**
```bash
docker-compose ps
```

### **Ver Logs**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### **Parar**
```bash
docker-compose down
```

---

## 📊 **URLs de Acesso**

### **Local (Docker)**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Database**: localhost:5432

### **Produção**
- **Frontend**: https://seu-projeto.vercel.app
- **Backend**: https://seu-backend.onrender.com

---

## 🔍 **Troubleshooting**

### **Problema**: Build falha no Vercel
**Solução**: Verifique se o `package.json` está na pasta `frontend/`

### **Problema**: Backend não conecta no banco
**Solução**: Verifique as variáveis de ambiente no Render

### **Problema**: Frontend não carrega dados
**Solução**: Verifique se `NEXT_PUBLIC_API_URL` está correto

### **Problema**: Docker não inicia
**Solução**: 
```bash
docker-compose down -v
docker-compose up --build -d
```

---

## ✅ **Checklist de Deploy**

- [ ] Backend deployado no Render
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados funcionando
- [ ] Login funcionando
- [ ] Multitenancy testado
- [ ] CRUD funcionando

---

**🎉 Deploy concluído com sucesso!**
