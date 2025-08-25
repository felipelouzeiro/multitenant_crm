#!/bin/bash

echo "🚀 Configurando banco de dados em produção..."

# Executar migrações
echo "📋 Executando migrações..."
npm run migration:run

# Aguardar um pouco
sleep 5

# Executar seed
echo "🌱 Executando seed..."
npm run setup:db

echo "✅ Setup concluído!"
