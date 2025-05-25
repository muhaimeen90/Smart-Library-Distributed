# Smart Library System - Circuit Breaker Test Script
# This script helps run and demonstrate the circuit breaker pattern implementation

Write-Host "================================" -ForegroundColor Cyan
Write-Host "CIRCUIT BREAKER PATTERN TEST" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This test will demonstrate how the circuit breaker pattern makes the system more resilient" -ForegroundColor Yellow
Write-Host "by handling failures gracefully when downstream services become unavailable."
Write-Host ""
Write-Host "The test will guide you through the following steps:" -ForegroundColor Yellow
Write-Host "1. Normal operation (circuit CLOSED) - all services running"
Write-Host "2. Failure simulation (stopping User Service) to show circuit OPEN state"
Write-Host "3. Service restoration to show circuit HALF-OPEN and then CLOSED states"
Write-Host ""
Write-Host "IMPORTANT: You will need to follow the prompts during the test to stop" -ForegroundColor Red
Write-Host "and restart the User Service in a separate terminal window."
Write-Host ""
Write-Host "Ready to begin? Press Enter to start the test..." -ForegroundColor Green
$null = Read-Host

# Check if services are running first
try {
    Write-Host "Checking if all services are running..." -ForegroundColor Cyan
    $userCheck = Invoke-RestMethod -Uri "http://localhost:8081" -TimeoutSec 2 -ErrorAction Stop
    $bookCheck = Invoke-RestMethod -Uri "http://localhost:8082" -TimeoutSec 2 -ErrorAction Stop
    $loanCheck = Invoke-RestMethod -Uri "http://localhost:8083" -TimeoutSec 2 -ErrorAction Stop
    
    Write-Host "✅ All services are running!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: Not all services are running" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start all services first using:" -ForegroundColor Yellow
    Write-Host "./start-services.ps1"
    Write-Host ""
    Write-Host "Then run this test again." -ForegroundColor Yellow
    exit 1
}

# Run the test script
Write-Host ""
Write-Host "Starting circuit breaker test..." -ForegroundColor Cyan
Write-Host "Follow the instructions in the console" -ForegroundColor Yellow
Write-Host ""
node circuit-breaker-test.js
