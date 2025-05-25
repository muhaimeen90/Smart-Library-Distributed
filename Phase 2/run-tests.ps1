# Smart Library System Microservices Advanced Tests Runner
# This script runs the advanced tests for the microservices

Write-Host "Running Smart Library System Advanced Microservices Tests..." -ForegroundColor Green

# Check if services are running
$userServiceUrl = "http://localhost:8081"
$bookServiceUrl = "http://localhost:8082"
$loanServiceUrl = "http://localhost:8083"

$allServicesRunning = $true

Write-Host "Checking if services are running..." -ForegroundColor Yellow

try {
    Invoke-WebRequest -Uri $userServiceUrl -Method Head -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host "User Service is running" -ForegroundColor Green
}
catch {
    Write-Host "User Service is not running" -ForegroundColor Red
    $allServicesRunning = $false
}

try {
    Invoke-WebRequest -Uri $bookServiceUrl -Method Head -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host "Book Service is running" -ForegroundColor Green
}
catch {
    Write-Host "Book Service is not running" -ForegroundColor Red
    $allServicesRunning = $false
}

try {
    Invoke-WebRequest -Uri $loanServiceUrl -Method Head -UseBasicParsing -ErrorAction Stop | Out-Null
    Write-Host "Loan Service is running" -ForegroundColor Green
}
catch {
    Write-Host "Loan Service is not running" -ForegroundColor Red
    $allServicesRunning = $false
}

if (-not $allServicesRunning) {
    Write-Host "Some services are not running. Please start all services first using: npm run dev" -ForegroundColor Red
    exit 1
}

# Create test-results directory if it doesn't exist
$testResultsDir = Join-Path -Path $PSScriptRoot -ChildPath "test-results"
if (-not (Test-Path -Path $testResultsDir)) {
    Write-Host "Creating test-results directory..." -ForegroundColor Yellow
    New-Item -Path $testResultsDir -ItemType Directory | Out-Null
}

# Run the advanced test script
Write-Host "Running advanced tests..." -ForegroundColor Yellow
node .\test-microservices.js

# Check if the tests passed
if ($LASTEXITCODE -eq 0) {
    Write-Host "All tests passed successfully!" -ForegroundColor Green
}
else {
    Write-Host "Some tests failed. Check the test report for details." -ForegroundColor Red
}
