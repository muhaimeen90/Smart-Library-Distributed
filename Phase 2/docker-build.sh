#!/bin/bash

echo "🐳 Building Smart Library System Docker Images..."
echo "================================================"

# Navigate to Phase 2 directory
cd "/home/muhaimeen/Academics/6th Sem/Distributed System/Smart-Library-Distributed/Phase 2"

# Build individual services
echo "📦 Building User Service..."
sudo docker build -t smart-library/user-service ./user-service
if [ $? -eq 0 ]; then
    echo "✅ User Service built successfully"
else
    echo "❌ User Service build failed"
    exit 1
fi

echo "📦 Building Book Service..."
sudo docker build -t smart-library/book-service ./book-service
if [ $? -eq 0 ]; then
    echo "✅ Book Service built successfully"
else
    echo "❌ Book Service build failed"
    exit 1
fi

echo "📦 Building Loan Service..."
sudo docker build -t smart-library/loan-service ./loan-service
if [ $? -eq 0 ]; then
    echo "✅ Loan Service built successfully"
else
    echo "❌ Loan Service build failed"
    exit 1
fi

echo "📦 Building Nginx..."
sudo docker build -t smart-library/nginx ./nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx built successfully"
else
    echo "❌ Nginx build failed"
    exit 1
fi

echo ""
echo "🎉 All Docker images built successfully!"
echo "📋 Available images:"
sudo docker images | grep smart-library
