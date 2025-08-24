#!/bin/bash

echo "🔍 Verificando dados do banco..."

echo ""
echo "📋 Usuários:"
docker-compose exec postgres psql -U postgres -d fullstack_challenge -c "SELECT name, email, role, \"tenantId\" FROM users;"

echo ""
echo "📋 Clientes:"
docker-compose exec postgres psql -U postgres -d fullstack_challenge -c "SELECT name, email, \"isActive\", \"tenantId\" FROM clients;"

echo ""
echo "✅ Verificação concluída!"
