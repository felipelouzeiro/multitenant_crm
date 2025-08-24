# MultiTenant CRM - Quick Start Script
# Windows PowerShell

Write-Host "Iniciando MultiTenant CRM..." -ForegroundColor Green

# Verificar se Docker está rodando
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "Docker nao encontrado. Instale o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se Docker Compose está disponível
try {
    docker-compose --version | Out-Null
    Write-Host "Docker Compose encontrado" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose nao encontrado." -ForegroundColor Red
    exit 1
}

# Parar containers existentes
Write-Host "Parando containers existentes..." -ForegroundColor Yellow
docker-compose down 2>$null

# Remover volumes se existirem
Write-Host "Limpando volumes antigos..." -ForegroundColor Yellow
docker volume prune -f 2>$null

# Construir e iniciar containers
Write-Host "Construindo e iniciando containers..." -ForegroundColor Yellow
docker-compose up --build -d

# Aguardar um pouco para os containers iniciarem
Write-Host "Aguardando containers iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar status dos containers
Write-Host "Verificando status dos containers..." -ForegroundColor Yellow
docker-compose ps

# Aguardar mais um pouco e executar setup do banco
Write-Host "Configurando banco de dados..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
docker-compose exec -T backend npm run migration:run
docker-compose exec -T backend npm run setup:db

Write-Host "Setup concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Acessos:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Usuarios de teste:" -ForegroundColor Cyan
Write-Host "   admin@acme.com / admin123" -ForegroundColor White
Write-Host "   admin@globex.com / admin123" -ForegroundColor White
Write-Host "   admin@initech.com / admin123" -ForegroundColor White
Write-Host ""
Write-Host "Dica: Teste o multitenancy fazendo login com diferentes tenants!" -ForegroundColor Yellow
