# Smart Library System Microservices
# This script starts all three microservices

Write-Host "Starting Smart Library System Microservices..." -ForegroundColor Green

# Start User Service
Write-Host "Starting User Service on port 8081 with nodemon..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/C cd C:\Academics\6th sem\Distributed-Systems\Phase 2\user-service && npm run dev"

# Wait a moment to allow User Service to start
Start-Sleep -Seconds 2

# Start Book Service
Write-Host "Starting Book Service on port 8082 with nodemon..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/C cd C:\Academics\6th sem\Distributed-Systems\Phase 2\book-service && npm run dev"

# Wait a moment to allow Book Service to start
Start-Sleep -Seconds 2

# Start Loan Service
Write-Host "Starting Loan Service on port 8083 with nodemon..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/C cd C:\Academics\6th sem\Distributed-Systems\Phase 2\loan-service && npm run dev"

Write-Host "`nAll services started successfully!" -ForegroundColor Green
Write-Host "User Service: http://localhost:8081" -ForegroundColor Yellow
Write-Host "Book Service: http://localhost:8082" -ForegroundColor Yellow
Write-Host "Loan Service: http://localhost:8083" -ForegroundColor Yellow
