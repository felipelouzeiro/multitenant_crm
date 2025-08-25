#!/bin/bash

echo "🚀 Iniciando aplicação em produção..."

# Executar migrações se necessário
echo "📋 Verificando migrações..."
npm run migration:run

# Executar seed se necessário
echo "🌱 Verificando dados iniciais..."
npm run setup:db

# Iniciar aplicação
echo "🎯 Iniciando aplicação..."
npm run start:prod
