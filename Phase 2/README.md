# Smart Library System - Microservices Architecture

This project is the microservices version of the Smart Library System, divided into three independent services — each responsible for a specific domain: User, Book, and Loan.

## Services Overview

### 1. User Service
- Handles registration, profile management, and user-related queries
- REST Base Path: `/users`
- Port: 8081
- Owns a user database

### 2. Book Service
- Manages book inventory, search, and updates to availability
- REST Base Path: `/books`
- Port: 8082
- Owns a book database

### 3. Loan Service
- Issues and returns books by communicating with both User Service and Book Service
- REST Base Path: `/loans`
- Port: 8083
- Owns a loan database
- Implements circuit breaker pattern for resilient inter-service communication

## Circuit Breaker Testing

The Loan Service implements a circuit breaker pattern to handle failures gracefully when downstream services (User and Book services) are unavailable. To test this pattern:

1. Start all three services:
   ```
   ./start-services.ps1
   ```

2. Run the circuit breaker test script:
   ```
   node circuit-breaker-test.js
   ```

3. Follow the instructions in the test output:
   - The test first demonstrates normal operation with all services running
   - You'll be prompted to stop the User Service to simulate a failure
   - The test will show how the circuit breaker responds to the failure
   - You'll then be prompted to restart the User Service
   - Finally, the test will show the circuit transitioning back to closed state

The test demonstrates all three circuit breaker states:
- **Closed**: Normal operation when all services are available
- **Open**: Fast-failing when a service is detected as unavailable
- **Half-Open**: Testing if service has recovered after the reset timeout

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install all dependencies for all services:
   ```
   cd "Phase 2"
   npm run install-all
   ```

### Starting the Services

You can start all services simultaneously using:
```
./start-services.ps1
```

For development with hot reloading (using nodemon):
```
npm run dev
```

Or start them individually:

1. User Service:
   ```
   cd user-service
   npm start
   ```

2. Book Service:
   ```
   cd book-service
   npm start
   ```

3. Loan Service:
   ```
   cd loan-service
   npm start
   ```

## API Documentation

### User Service Endpoints

#### POST /users
Create/register a new user.

Request:
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "student"
}
```

#### GET /users/{id}
Fetch user profile by ID.

#### PUT /users/{id}
Update user information.

Request:
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com"
}
```

### Book Service Endpoints

#### POST /books
Add a new book.

Request:
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "copies": 3
}
```

#### GET /books?search=clean
Search for books by title, author, or keyword.

#### GET /books/{id}
Retrieve detailed information about a specific book.

#### PUT /books/{id}
Update book information.

#### PATCH /books/{id}/availability
Update a book's available copies.

Request:
```json
{
  "operation": "increment"
}
```
Or:
```json
{
  "available_copies": 4
}
```

#### DELETE /books/{id}
Remove a book from the catalog.

### Loan Service Endpoints

#### POST /loans
Issue a book to a user.

Request:
```json
{
  "user_id": 1,
  "book_id": 42,
  "due_date": "2025-06-03T23:59:59Z"
}
```

#### POST /returns
Return a borrowed book.

Request:
```json
{
  "loan_id": 1001
}
```

#### GET /loans/user/{user_id}
Get a user's loan history (active and returned books).

#### GET /loans/{id}
Get details of a specific loan.

## Inter-Service Communication

In this architecture:
- The Loan Service directly calls APIs exposed by the User Service and Book Service.
- For example, when issuing a book, the Loan Service:
  - Calls GET /users/{id} to verify the user exists
  - Calls GET /books/{id} to check book availability
  - Calls PATCH /books/{id}/availability to update book availability

## Testing the Microservices

For a complete overview of testing, see [TESTING-REPORT.md](TESTING-REPORT.md)

### Basic Testing
To run basic tests that verify all services are running correctly:
```
npm test
```
or
```
.\run-tests-new.ps1
```

This script checks:
- If all services are running
- Basic CRUD operations for each service
- Inter-service communication

### Advanced Testing
For comprehensive testing with detailed reporting:
```
npm run test:advanced
```
or
```
.\run-advanced-tests.ps1
```

Advanced tests include:
- Validation of all API endpoints
- Error handling scenarios
- Data persistence verification
- Proper inter-service communication
- Detailed test reports generation (saved in the test-results directory)

### Manual Testing
You can also test each service's API endpoints using tools like Postman or curl. Examples:

#### Create a new user:
```
curl -X POST http://localhost:8081/users -H "Content-Type: application/json" -d "{\"name\":\"Test User\", \"email\":\"test@example.com\", \"role\":\"student\"}"
```

#### Add a new book:
```
curl -X POST http://localhost:8082/books -H "Content-Type: application/json" -d "{\"title\":\"Test Book\", \"author\":\"Test Author\", \"isbn\":\"1234567890123\", \"copies\":5}"
```

#### Issue a book:
```
curl -X POST http://localhost:8083/loans -H "Content-Type: application/json" -d "{\"user_id\":1, \"book_id\":1, \"due_date\":\"2023-06-30\"}"
```
