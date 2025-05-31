#!/bin/bash

echo "🔍 Testing Dockerized Smart Library System..."
echo "============================================"

# Navigate to Phase 2 directory
cd "/home/muhaimeen/Academics/6th Sem/Distributed System/Smart-Library-Distributed/Phase 2"

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    echo -n "Testing $name... "
    
    if curl -s -f "$url" > /dev/null; then
        echo "✅ Success"
        return 0
    else
        echo "❌ Failed"
        return 1
    fi
}

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

echo ""
echo "🧪 Running health checks..."

# Test individual services
test_endpoint "http://localhost:8081/users" "User Service"
test_endpoint "http://localhost:8082/books" "Book Service"
test_endpoint "http://localhost:8083/loans" "Loan Service"

# Test nginx proxy
test_endpoint "http://localhost/health" "Nginx Health Check"
test_endpoint "http://localhost/users" "User Service via Nginx"
test_endpoint "http://localhost/books" "Book Service via Nginx"
test_endpoint "http://localhost/loans" "Loan Service via Nginx"

echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "📝 Recent logs:"
echo "User Service logs:"
docker-compose logs --tail=5 user-service

echo ""
echo "Book Service logs:"
docker-compose logs --tail=5 book-service

echo ""
echo "Loan Service logs:"
docker-compose logs --tail=5 loan-service

echo ""
echo "Nginx logs:"
docker-compose logs --tail=5 nginx
