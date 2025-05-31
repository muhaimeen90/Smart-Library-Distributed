#!/bin/bash

echo "🛑 Stopping Smart Library System..."
echo "=================================="

# Navigate to Phase 2 directory
cd "/home/muhaimeen/Academics/6th Sem/Distributed System/Smart-Library-Distributed/Phase 2"

# Stop all services
echo "⏹️  Stopping all containers..."
docker-compose down

echo ""
echo "🧹 Cleanup options:"
echo "  🗑️  Remove volumes: docker-compose down -v"
echo "  🗑️  Remove images: docker-compose down --rmi all"
echo "  🗑️  Remove everything: docker-compose down -v --rmi all --remove-orphans"

echo ""
echo "✅ All services stopped successfully!"
