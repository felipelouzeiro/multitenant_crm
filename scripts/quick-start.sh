#!/bin/bash

# Quick Start Script para MultiTenant CRM
# Linux/Mac

echo "🚀 Iniciando MultiTenant CRM..."

# Verificar se Docker está rodando
echo "📋 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi
echo "✅ Docker encontrado"

# Verificar se Docker Compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado."
    exit 1
fi
echo "✅ Docker Compose encontrado"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null

# Remover volumes se existirem
echo "🧹 Limpando volumes antigos..."
docker volume prune -f 2>/dev/null

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar um pouco para os containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 30

# Verificar status dos containers
echo "📊 Verificando status dos containers..."
docker-compose ps

# Aguardar mais um pouco e executar setup do banco
echo "🌱 Configurando banco de dados..."
sleep 10
docker-compose exec -T backend npm run migration:run
docker-compose exec -T backend npm run setup:db

echo "✅ Setup concluído!"
echo ""
echo "🌐 Acessos:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "👤 Usuários de teste:"
echo "   admin@acme.com / admin123"
echo "   admin@globex.com / admin123"
echo "   admin@initech.com / admin123"
echo ""
echo "💡 Dica: Teste o multitenancy fazendo login com diferentes tenants!"
