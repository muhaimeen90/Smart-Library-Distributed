# Smart Library Management System

A distributed library management system showcasing the evolution from monolithic to microservices architecture.

## 📚 Project Overview

This project demonstrates two architectural approaches for building a library management system:

### **Phase 1: Monolithic Architecture**
- **Type**: Single application with all components integrated
- **Technology**: Node.js with Express, SQLite database
- **Structure**: All services (users, books, loans) in one codebase
- **Deployment**: Single server instance
- **Database**: Shared SQLite database file

**Features:**
- User registration and management
- Book catalog and inventory management  
- Loan processing and returns
- RESTful API endpoints

### **Phase 2: Microservices Architecture (Docker)**
- **Type**: Distributed system with independent services
- **Technology**: Docker containers, Nginx reverse proxy
- **Structure**: Separate services for users, books, loans, and gateway
- **Deployment**: Multi-container Docker Compose orchestration
- **Database**: Individual databases per service

**Features:**
- Independent service scaling
- Container-based deployment
- Service discovery and communication
- API gateway with load balancing
- Circuit breaker pattern for resilience

## 🚀 Quick Start

### **Phase 1 (Monolithic)**
```bash
cd "Phase 1"
npm install
npm start
# Access: http://localhost:3000
```

### **Phase 2 (Microservices)**
```bash
cd "Phase 2"
./docker-run.sh
# Access: http://localhost
```

## 📁 Project Structure

```
Smart-Library-Distributed/
├── Phase 1/           # Monolithic application
│   ├── index.js       # Main application entry
│   ├── models/        # Database models
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   └── README.md      # Phase 1 documentation
├── Phase 2/           # Microservices application
│   ├── docker-compose.yml  # Container orchestration
│   ├── user-service/       # User management service
│   ├── book-service/       # Book catalog service
│   ├── loan-service/       # Loan processing service
│   ├── nginx/             # API gateway
│   └── README.md          # Phase 2 documentation
└── README.md          # This file
```

## 🎯 Learning Objectives

This project demonstrates:
- **Monolithic vs Microservices** trade-offs
- **Docker containerization** and orchestration
- **Service communication** patterns
- **API gateway** implementation
- **Database per service** pattern
- **Circuit breaker** resilience pattern

## 📖 Documentation

- **[Phase 1 README](Phase%201/README.md)** - Monolithic implementation details
- **[Phase 2 README](Phase%202/README.md)** - Microservices Docker deployment guide

---

**Choose your architecture:** Start with Phase 1 for simplicity or jump to Phase 2 for production-ready microservices! 🚀