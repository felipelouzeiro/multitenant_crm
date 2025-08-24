Write-Host "🚀 Iniciando setup do Fullstack Tech Challenge..." -ForegroundColor Green

# Verificar se o Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Docker Compose está instalado
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro." -ForegroundColor Red
    exit 1
}

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Perguntar sobre remoção de volumes
$removeVolumes = Read-Host "Deseja remover volumes existentes? (y/N)"
if ($removeVolumes -eq "y" -or $removeVolumes -eq "Y") {
    Write-Host "🗑️ Removendo volumes existentes..." -ForegroundColor Yellow
    docker-compose down -v
}

# Build e iniciar containers
Write-Host "🔨 Fazendo build dos containers..." -ForegroundColor Yellow
docker-compose up --build -d

# Aguardar o banco de dados estar pronto
Write-Host "⏳ Aguardando banco de dados estar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Executar reset do banco
Write-Host "🌱 Executando reset do banco de dados..." -ForegroundColor Yellow
docker-compose exec backend npm run reset:db

Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Aplicação disponível em:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   Swagger Docs: http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "👤 Usuários de teste:" -ForegroundColor Cyan
Write-Host "   Admin: admin@example.com / admin123" -ForegroundColor White
Write-Host "   User: user@example.com / user123" -ForegroundColor White
Write-Host "   Guest: guest@example.com / guest123" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f    # Ver logs" -ForegroundColor White
Write-Host "   docker-compose down       # Parar containers" -ForegroundColor White
Write-Host "   docker-compose restart    # Reiniciar containers" -ForegroundColor White
