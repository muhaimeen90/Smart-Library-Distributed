#!/bin/bash

# Stop and remove containers
docker stop nginx loan-service book-service user-service 2>/dev/null
docker rm nginx loan-service book-service user-service 2>/dev/null

