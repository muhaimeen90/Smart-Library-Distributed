#!/bin/bash

cd "/home/muhaimeen/Academics/6th Sem/Distributed System/Smart-Library-Distributed/Phase 2"

# Setup
sudo systemctl stop nginx 2>/dev/null || true
docker network create library-network 2>/dev/null || true
docker volume create user-data book-data loan-data 2>/dev/null || true


# Start services
docker run -d --name user-service --network library-network -p 8081:8081 -v user-data:/app/data phase2-user-service
docker run -d --name book-service --network library-network -p 8082:8082 -v book-data:/app/data phase2-book-service
docker run -d --name loan-service --network library-network -p 8083:8083 -v loan-data:/app/data -e USER_SERVICE_URL=http://user-service:8081 -e BOOK_SERVICE_URL=http://book-service:8082 phase2-loan-service
docker run -d --name nginx --network library-network -p 80:80 phase2-nginx

echo "✅ Started! Access at: http://localhost"
