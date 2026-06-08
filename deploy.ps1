# Script de déploiement pour Windows - Frise Mecquoise
# À lancer dalam PowerShell depuis le dossier du projet

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 DÉPLOIEMENT FRISE MECQUOISE" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$GitHubUser = Read-Host "📝 Entre ton username GitHub"
$RepoName = "frise-mecquoise"

Write-Host ""
Write-Host "⚙️  Configuration..." -ForegroundColor Yellow

# Initialiser Git si nécessaire
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Frise Mecquoise - Interactive Timeline"
    git branch -M main
}

# Ajouter la remote si elle n'existe pas
$remoteExists = git remote | Select-String "origin"
if (-not $remoteExists) {
    Write-Host "🔗 Ajout de la remote GitHub..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$GitHubUser/$RepoName.git"
}

# Push le code
Write-Host "📤 Push vers GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ ÉTAPE 1 COMPLÈTE !" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📋 PROCHAINE ÉTAPE : VERCEL" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Va sur https://vercel.com" -ForegroundColor White
Write-Host "2️⃣  Clique 'Sign Up' → 'Continue with GitHub'" -ForegroundColor White
Write-Host "3️⃣  Sélectionne le repo '$RepoName'" -ForegroundColor White
Write-Host "4️⃣  Clique 'Deploy' et attends 1-2 minutes" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Ton site sera accessible à:" -ForegroundColor Green
Write-Host "   https://$RepoName.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✨ Merci d'avoir choisi Vercel !" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

