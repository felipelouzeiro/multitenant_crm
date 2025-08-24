#!/bin/bash

echo "🐳 Iniciando setup do Fullstack Tech CRM com Docker..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover volumes antigos (opcional)
read -p "Deseja remover volumes antigos? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo volumes antigos..."
    docker-compose down -v
fi

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Aguardar o banco estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Verificar se os containers estão rodando
echo "🔍 Verificando status dos containers..."
docker-compose ps

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📱 Aplicação disponível em:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Database: localhost:5432"
echo ""
echo "👤 Usuários de teste:"
echo "   ACME: admin@acme.com / admin123"
echo "   GLOBEX: admin@globex.com / admin123"
echo "   INITECH: admin@initech.com / admin123"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose logs -f backend    # Ver logs do backend"
echo "   docker-compose logs -f frontend   # Ver logs do frontend"
echo "   docker-compose down               # Parar containers"
echo "   docker-compose restart            # Reiniciar containers"
