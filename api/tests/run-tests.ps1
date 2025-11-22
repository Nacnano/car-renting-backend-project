# PowerShell script to run API server and Newman tests

Write-Host "=== Car Rental API Test Runner ===" -ForegroundColor Cyan
Write-Host ""

# Change to API directory
$apiDir = Split-Path -Parent $PSScriptRoot
Set-Location $apiDir

# Check if newman is installed
Write-Host "Checking Newman installation..." -ForegroundColor Yellow
$newmanInstalled = $false
try {
    $newmanCheck = Get-Command newman -ErrorAction Stop
    Write-Host "Newman is installed" -ForegroundColor Green
    $newmanInstalled = $true
} catch {
    Write-Host "Newman is not installed" -ForegroundColor Red
    Write-Host "Installing Newman globally..." -ForegroundColor Yellow
    npm install -g newman
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Newman" -ForegroundColor Red
        exit 1
    }
    $newmanInstalled = $true
}

Write-Host ""
Write-Host "Starting API server..." -ForegroundColor Yellow

# Start the API server in a new process
$serverProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiDir'; npm run dev" -PassThru -WindowStyle Normal

Write-Host "API server started (PID: $($serverProcess.Id))" -ForegroundColor Green
Write-Host "Waiting 8 seconds for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

try {
    Write-Host ""
    Write-Host "Running Newman tests..." -ForegroundColor Yellow
    Write-Host "======================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Run Newman tests
    newman run tests/car-rental-api.postman_collection.json
    
    $testExitCode = $LASTEXITCODE
    
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Cyan
    
    if ($testExitCode -eq 0) {
        Write-Host "All tests passed!" -ForegroundColor Green
    } else {
        Write-Host "Some tests failed" -ForegroundColor Red
    }
} finally {
    Write-Host ""
    Write-Host "Stopping API server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "API server stopped" -ForegroundColor Green
}

Write-Host ""
Write-Host "Test run complete!" -ForegroundColor Cyan
Write-Host ""
