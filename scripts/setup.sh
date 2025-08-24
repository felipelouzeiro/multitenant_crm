#!/bin/bash

echo "🚀 Iniciando setup do Fullstack Tech CRM..."

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

# Remover volumes existentes (opcional)
read -p "Deseja remover volumes existentes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removendo volumes existentes..."
    docker-compose down -v
fi

# Build e iniciar containers
echo "🔨 Fazendo build dos containers..."
docker-compose up --build -d

# Aguardar o banco de dados estar pronto
echo "⏳ Aguardando banco de dados estar pronto..."
sleep 15

# Executar seed
echo "🌱 Executando seed do banco de dados..."
docker-compose exec backend npm run seed

echo "✅ Setup concluído!"
echo ""
echo "📱 Aplicação disponível em:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Swagger Docs: http://localhost:3001/api"
echo ""
echo "👤 Usuários de teste:"
echo "   Admin: admin@example.com / admin123"
echo "   User: user@example.com / user123"
echo "   Guest: guest@example.com / guest123"
echo ""
echo "🔧 Comandos úteis:"
echo "   docker-compose logs -f    # Ver logs"
echo "   docker-compose down       # Parar containers"
echo "   docker-compose restart    # Reiniciar containers"
