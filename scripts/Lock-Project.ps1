# Lock-Project.ps1
param (
    [string]$Action = "lock"
)

$TargetDir = "./src"

if ($Action -eq "lock") {
    Write-Host "🔒 Locking directory permissions for code safety..." -ForegroundColor Yellow
    # Removes write permissions for the current user session on the target folder
    Deny-Access -Path $TargetDir -Permissions Write
} 
elseif ($Action -eq "unlock") {
    Write-Host "🛡️ Running verification protocol..." -ForegroundColor Cyan
    node scripts/ensure_planning.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🔓 Planning passed! Unlocking source directory..." -ForegroundColor Green
        Grant-Access -Path $TargetDir -Permissions Write
    } else {
        Write-Host "❌ Unlock Denied: Fix your planning documents first." -ForegroundColor Red
    }
}
