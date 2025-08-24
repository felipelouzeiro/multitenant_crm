Write-Host "🐳 Iniciando setup do Fullstack Tech CRM com Docker..." -ForegroundColor Green

# Verificar se o Docker está instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Docker Compose está instalado
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker e Docker Compose encontrados" -ForegroundColor Green

# Parar containers existentes
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down

# Remover volumes antigos (opcional)
$removeVolumes = Read-Host "Deseja remover volumes antigos? (y/N)"
if ($removeVolumes -eq "y" -or $removeVolumes -eq "Y") {
    Write-Host "🗑️ Removendo volumes antigos..." -ForegroundColor Yellow
    docker-compose down -v
}

# Construir e iniciar containers
Write-Host "🔨 Construindo e iniciando containers..." -ForegroundColor Yellow
docker-compose up --build -d

# Aguardar o banco estar pronto
Write-Host "⏳ Aguardando PostgreSQL estar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar se os containers estão rodando
Write-Host "🔍 Verificando status dos containers..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Aplicação disponível em:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "👤 Usuários de teste:" -ForegroundColor Cyan
Write-Host "   ACME: admin@acme.com / admin123" -ForegroundColor White
Write-Host "   GLOBEX: admin@globex.com / admin123" -ForegroundColor White
Write-Host "   INITECH: admin@initech.com / admin123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Comandos úteis:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f backend    # Ver logs do backend" -ForegroundColor White
Write-Host "   docker-compose logs -f frontend   # Ver logs do frontend" -ForegroundColor White
Write-Host "   docker-compose down               # Parar containers" -ForegroundColor White
Write-Host "   docker-compose restart            # Reiniciar containers" -ForegroundColor White
