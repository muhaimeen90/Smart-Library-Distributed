// HTTP Client for Service Communication with Circuit Breaker
const axios = require('axios');
const CircuitBreaker = require('opossum');

// Create axios instances with default configurations
const userServiceClient = axios.create({
  baseURL: process.env.USER_SERVICE_URL || 'http://localhost:8081',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const bookServiceClient = axios.create({
  baseURL: process.env.BOOK_SERVICE_URL || 'http://localhost:8082',
  timeout: 5000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Circuit breaker options
const circuitOptions = {
  failureThreshold: 50,       // 50% failure triggers open circuit
  resetTimeout: 10000,        // 10 seconds before retry
  timeout: 5000,              // 5 seconds timeout for function execution
  errorThresholdPercentage: 50,
  rollingCountTimeout: 10000, // 10 seconds window for metrics collection
  rollingCountBuckets: 10,    // 10 buckets for metrics
};

// Add request interceptors for logging
userServiceClient.interceptors.request.use(
  config => {
    console.log(`Request to User Service: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('User Service Request Error:', error);
    return Promise.reject(error);
  }
);

bookServiceClient.interceptors.request.use(
  config => {
    console.log(`Request to Book Service: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Book Service Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptors for logging
userServiceClient.interceptors.response.use(
  response => {
    console.log(`Response from User Service: ${response.status}`);
    return response;
  },
  error => {
    console.error('User Service Response Error:', error.message);
    return Promise.reject(error);
  }
);

bookServiceClient.interceptors.response.use(
  response => {
    console.log(`Response from Book Service: ${response.status}`);
    return response;
  },
  error => {
    console.error('Book Service Response Error:', error.message);
    return Promise.reject(error);
  }
);

module.exports = {
  // Circuit breaker wrapped clients
  userService: {
    get: async (url, config) => {
      const breaker = new CircuitBreaker(
        async () => userServiceClient.get(url, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to User Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to User Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to User Service is closed (service is available)'));
      
      return breaker.fire();
    },
    post: async (url, data, config) => {
      const breaker = new CircuitBreaker(
        async () => userServiceClient.post(url, data, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to User Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to User Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to User Service is closed (service is available)'));
      
      return breaker.fire();
    },
    put: async (url, data, config) => {
      const breaker = new CircuitBreaker(
        async () => userServiceClient.put(url, data, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to User Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to User Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to User Service is closed (service is available)'));
      
      return breaker.fire();
    }
  },
  bookService: {
    get: async (url, config) => {
      const breaker = new CircuitBreaker(
        async () => bookServiceClient.get(url, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to Book Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to Book Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to Book Service is closed (service is available)'));
      
      return breaker.fire();
    },
    post: async (url, data, config) => {
      const breaker = new CircuitBreaker(
        async () => bookServiceClient.post(url, data, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to Book Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to Book Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to Book Service is closed (service is available)'));
      
      return breaker.fire();
    },
    patch: async (url, data, config) => {
      const breaker = new CircuitBreaker(
        async () => bookServiceClient.patch(url, data, config),
        circuitOptions
      );
      
      breaker.on('open', () => console.log('Circuit to Book Service is open (failing fast)'));
      breaker.on('halfOpen', () => console.log('Circuit to Book Service is half open (testing if service is available)'));
      breaker.on('close', () => console.log('Circuit to Book Service is closed (service is available)'));
      
      return breaker.fire();
    }
  },
  // Original clients also exposed for direct access if needed
  userServiceClient,
  bookServiceClient
};
