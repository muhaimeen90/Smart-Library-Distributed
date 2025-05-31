# Smart Library System - Docker Deployment Guide

This guide explains how to run the Smart Library System microservices using Docker containers.

## 🏗️ Architecture

The system consists of 4 containerized services:

- **User Service** (Port 8081): Manages user operations
- **Book Service** (Port 8082): Manages book inventory
- **Loan Service** (Port 8083): Manages book loans and returns
- **Nginx Proxy** (Port 80): Load balancer and reverse proxy

## 📋 Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB free RAM
- Ports 80, 8081, 8082, 8083 available

## 🚀 Quick Start

### 1. Build All Services
```bash
./docker-build.sh
```

### 2. Start All Services
```bash
./docker-run.sh
```

### 3. Test the System
```bash
./docker-test.sh
```

### 4. Stop All Services
```bash
./docker-stop.sh
```

## 🔧 Manual Commands

### Build Individual Services
```bash
# Build user service
docker build -t smart-library/user-service ./user-service

# Build book service
docker build -t smart-library/book-service ./book-service

# Build loan service
docker build -t smart-library/loan-service ./loan-service

# Build nginx
docker build -t smart-library/nginx ./nginx
```

### Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🌐 Service Endpoints

### Direct Service Access
- User Service: http://localhost:8081/users
- Book Service: http://localhost:8082/books
- Loan Service: http://localhost:8083/loans

### Via Nginx Proxy
- Users: http://localhost/users
- Books: http://localhost/books
- Loans: http://localhost/loans
- Health Check: http://localhost/health

### Custom Domain (after hosts file setup)
- http://muhaimeen-library-app.com/users
- http://muhaimeen-library-app.com/books
- http://muhaimeen-library-app.com/loans

## 🔍 Monitoring and Debugging

### View Container Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs user-service
docker-compose logs book-service
docker-compose logs loan-service
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f [service-name]
```

### Execute Commands in Containers
```bash
# Access container shell
docker-compose exec user-service sh
docker-compose exec book-service sh
docker-compose exec loan-service sh
docker-compose exec nginx sh
```

### Health Checks
```bash
# Check service health
docker-compose exec user-service wget --spider http://localhost:8081/
docker-compose exec book-service wget --spider http://localhost:8082/
docker-compose exec loan-service wget --spider http://localhost:8083/
```

## 📊 API Testing Examples

### Create a User
```bash
curl -X POST http://localhost/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890"}'
```

### Add a Book
```bash
curl -X POST http://localhost/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker Guide","author":"Tech Author","isbn":"123-456-789","totalCopies":5}'
```

### Create a Loan
```bash
curl -X POST http://localhost/loans \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"bookId":1}'
```

## 🔧 Configuration

### Environment Variables
- Check `.env.docker` for configuration options
- Modify `docker-compose.yml` for service-specific settings

### Network Configuration
- Services communicate via `library-network` bridge network
- Subnet: 172.20.0.0/16

### Volume Mounts
- SQLite databases are mounted to preserve data
- Log directories for debugging

## 🛠️ Troubleshooting

### Services Won't Start
1. Check if ports are available: `netstat -tulpn | grep :80`
2. Verify Docker is running: `docker --version`
3. Check logs: `docker-compose logs`

### Cannot Access Services
1. Verify containers are running: `docker-compose ps`
2. Check service health: `docker-compose exec [service] wget --spider http://localhost:[port]/`
3. Test network connectivity: `docker-compose exec nginx ping user-service`

### Database Issues
1. Check database file permissions
2. Verify volume mounts in docker-compose.yml
3. Restart services: `docker-compose restart`

### Performance Issues
1. Monitor resource usage: `docker stats`
2. Check available memory: `free -h`
3. Increase container resources if needed

## 🔄 Development Workflow

### Code Changes
1. Make changes to service code
2. Rebuild specific service: `docker-compose build [service-name]`
3. Restart service: `docker-compose restart [service-name]`

### Adding New Services
1. Create new service directory with Dockerfile
2. Add service to docker-compose.yml
3. Update nginx configuration if needed
4. Rebuild and restart

## 📝 Notes

- SQLite databases are persisted via volume mounts
- Services use health checks for dependency management
- Nginx provides load balancing and SSL termination capabilities
- All services run as non-root users for security
