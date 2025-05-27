#!/usr/bin/env bash

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo -e "\nStarting Smart Library System Microservices...\n"

# Launch User Service in background
(cd "$BASE_DIR/user-service" && npm run dev) &
USER_PID=$!

# Launch Book Service in background
(cd "$BASE_DIR/book-service" && npm run dev) &
BOOK_PID=$!

# Launch Loan Service in background
(cd "$BASE_DIR/loan-service" && npm run dev) &
LOAN_PID=$!

echo -e "\nAll services launched.\n"
echo "User Service (PID $USER_PID): http://localhost:8081"
echo "Book Service (PID $BOOK_PID): http://localhost:8082"
echo "Loan Service (PID $LOAN_PID): http://localhost:8083"
