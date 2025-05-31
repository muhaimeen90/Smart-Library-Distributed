#!/bin/bash

echo "🚀 Starting Smart Library System with Docker Compose..."
echo "====================================================="

# Navigate to Phase 2 directory
cd "/home/muhaimeen/Academics/6th Sem/Distributed System/Smart-Library-Distributed/Phase 2"

# Start all services
echo "🔧 Starting all services..."
sudo docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "📊 Service Status:"
sudo docker compose ps

echo ""
echo "🌐 Service Endpoints:"
echo "  📍 User Service: http://localhost:8081"
echo "  📍 Book Service: http://localhost:8082" 
echo "  📍 Loan Service: http://localhost:8083"
echo "  📍 Nginx Proxy: http://localhost"
echo "  📍 Custom Domain: http://muhaimeen-library-app.com"

echo ""
echo "🔍 Health Check Commands:"
echo "  curl http://localhost:8081/users"
echo "  curl http://localhost:8082/books"
echo "  curl http://localhost:8083/loans"
echo "  curl http://localhost/health"

echo ""
echo "📝 View logs with: sudo docker compose logs -f [service-name]"
echo "🛑 Stop services with: sudo docker compose down"
