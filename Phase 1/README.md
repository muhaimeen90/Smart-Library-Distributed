# Smart Library System - Phase 1: Monolithic Architecture

A traditional monolithic library management system built with Node.js, Express, and SQLite. All components are integrated into a single application with shared database and codebase.

## 🏗️ Monolithic Architecture Overview

This phase demonstrates a **single-tier application** where all functionality is contained within one codebase:

- **Single Process**: All services run in one Node.js process
- **Shared Database**: One SQLite database for all entities
- **Unified Codebase**: All business logic in one project
- **Simple Deployment**: Single server deployment

### **Core Components**
- **User Management**: Registration, profiles, authentication
- **Book Catalog**: Inventory management, search, CRUD operations
- **Loan Processing**: Book lending, returns, tracking
- **Unified API**: RESTful endpoints served from one server

## 🚀 Quick Start

### **Prerequisites**
- Node.js 14+ 
- npm 6+
- 2GB+ free disk space

### **Installation & Running**
```bash
# Navigate to Phase 1
cd "Phase 1"

# Install dependencies
npm install

# Start the server
npm start
```

**Access the system:** `http://localhost:3000`

### **Database Setup**
```bash
# Seed the database with sample data
node seed.js
```

## 📊 Application Structure

```
Phase 1/
├── 📄 Entry Point
│   ├── index.js              # Main application server
│   └── package.json          # Dependencies and scripts
├── 🗄️ Database
│   ├── database.sqlite       # SQLite database file
│   └── seed.js              # Database seeding script
├── ⚙️ Configuration
│   └── config/
│       └── database.js       # Database connection setup
├── 🏛️ Models (Data Layer)
│   ├── models/
│   │   ├── index.js         # Model exports
│   │   ├── User.js          # User entity
│   │   ├── Book.js          # Book entity
│   │   └── Loan.js          # Loan entity
├── 🎮 Controllers (Business Logic)
│   ├── controllers/
│   │   ├── userController.js # User operations
│   │   ├── bookController.js # Book operations
│   │   └── loanController.js # Loan operations
├── 🛣️ Routes (API Layer)
│   ├── routes/
│   │   ├── userRoutes.js    # User API endpoints
│   │   ├── bookRoutes.js    # Book API endpoints
│   │   └── loanRoutes.js    # Loan API endpoints
├── 🛡️ Middleware
│   ├── middleware/
│   │   ├── validate.js      # Input validation
│   │   └── errorHandler.js  # Error handling
├── 🔧 Utilities
│   ├── utils/
│   │   ├── databaseSeeder.js # Data seeding
│   │   ├── dateUtils.js     # Date utilities
│   │   └── validationSchemas.js # Validation rules
└── 🧪 Testing
    ├── test-api-endpoints.js
    ├── test-controller-interactions.js
    ├── test-loan-controller.js
    └── test-loan-flow.js
```

## 🌐 API Endpoints

### **User Management**
```http
POST   /api/users          # Create new user
GET    /api/users/:id      # Get user by ID
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
GET    /api/users          # List all users
```

### **Book Catalog**
```http
POST   /api/books          # Add new book
GET    /api/books/:id      # Get book by ID
PUT    /api/books/:id      # Update book
DELETE /api/books/:id      # Delete book
GET    /api/books          # Search books
PATCH  /api/books/:id/availability # Update book availability
```

### **Loan Management**
```http
POST   /api/loans          # Issue a book
GET    /api/loans/:id      # Get loan details
GET    /api/loans/user/:userId # Get user's loans
POST   /api/returns        # Return a book
GET    /api/loans          # List all loans
```

## 🧪 Testing

### **Run All Tests**
```bash
# Test API endpoints
node test-api-endpoints.js

# Test controller interactions
node test-controller-interactions.js

# Test loan workflow
node test-loan-flow.js

# Test loan controller
node test-loan-controller.js
```

### **Manual API Testing**

#### **Create a User**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@library.com",
    "role": "student"
  }'
```

#### **Add a Book**
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "isbn": "9780135957059",
    "copies": 5
  }'
```

#### **Issue a Book**
```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "book_id": 1,
    "due_date": "2025-07-01"
  }'
```

#### **Search Books**
```bash
curl "http://localhost:3000/api/books?search=pragmatic"
```

## 🗃️ Database Schema

### **Users Table**
```sql
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('student', 'faculty', 'staff') DEFAULT 'student',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Books Table**
```sql
CREATE TABLE Books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Loans Table**
```sql
CREATE TABLE Loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date DATETIME NOT NULL,
  return_date DATETIME NULL,
  status ENUM('active', 'returned', 'overdue') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (book_id) REFERENCES Books(id)
);
```

## ⚡ Development Features

### **Hot Reloading**
```bash
# Install nodemon for development
npm install -g nodemon

# Start with auto-restart
nodemon index.js
```

### **Environment Configuration**
```bash
# Set environment variables
export NODE_ENV=development
export PORT=3000
export DB_PATH=./database.sqlite
```

### **Logging**
- Request logging with Morgan
- Error logging to console
- SQL query logging (development mode)

## 📈 Performance Considerations

### **Advantages of Monolithic Architecture**
- ✅ **Simple Development**: Single codebase, easy to understand
- ✅ **Easy Deployment**: One application to deploy
- ✅ **Fast Inter-Component Communication**: No network overhead
- ✅ **ACID Transactions**: Database consistency across all operations
- ✅ **Simple Testing**: End-to-end testing in one environment

### **Limitations**
- ❌ **Scaling**: Entire application must be scaled together
- ❌ **Technology Lock-in**: Entire app uses same tech stack
- ❌ **Single Point of Failure**: If one component fails, all fail
- ❌ **Large Codebase**: Can become complex as features grow

## 🔧 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### **Database Locked**
```bash
# Remove database file and recreate
rm database.sqlite
node seed.js
```

#### **Permission Issues**
```bash
# Fix file permissions
chmod 755 index.js
chmod 644 database.sqlite
```

### **Debug Mode**
```bash
# Run with debug logging
DEBUG=* node index.js

# Or start with Node.js debugger
node --inspect index.js
```

## 🔄 Migration to Phase 2

This monolithic application serves as the foundation for Phase 2 (microservices). Key differences when migrating:

| Aspect | Phase 1 (Monolithic) | Phase 2 (Microservices) |
|--------|---------------------|-------------------------|
| **Architecture** | Single application | Multiple services |
| **Database** | Shared SQLite | Service-specific databases |
| **Communication** | Function calls | HTTP/REST APIs |
| **Deployment** | Single process | Docker containers |
| **Scaling** | Vertical only | Independent horizontal scaling |

## 📚 Additional Resources

- **[Phase 2 README](../Phase%202/README.md)**: Microservices implementation
- **[Main Project README](../README.md)**: Architecture comparison
- **[Refactoring Documentation](REFACTORING-DOCUMENTATION.md)**: Code structure details

---

## 🎯 Quick Commands Reference

```bash
# Start development server
npm start

# Run tests
node test-api-endpoints.js

# Seed database
node seed.js

# Check application health
curl http://localhost:3000/api/users
```

**🚀 Your monolithic Smart Library System is ready!**

Access the API at: **http://localhost:3000**