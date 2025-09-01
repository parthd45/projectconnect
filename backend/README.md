# ProjectConnect Backend

A robust authentication backend for ProjectConnect built with Node.js and Express.

## Features

- ✅ User Registration with password hashing
- ✅ User Login with JWT tokens
- ✅ Protected routes with JWT authentication
- ✅ CORS configuration for frontend integration
- ✅ Rate limiting for security
- ✅ Input validation and sanitization
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan
- ✅ OAuth placeholders (Google & GitHub)

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth (placeholder)
- `POST /api/auth/github` - GitHub OAuth (placeholder)

### Protected Endpoints
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

## Environment Variables

```env
NODE_ENV=production
PORT=8080
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=https://projectconnect.tech
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Local Development

```bash
npm install
npm run dev
```

## Production Deployment

```bash
npm install --production
npm start
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers
- Input validation
- Request logging

## Data Storage

Currently uses in-memory storage for simplicity. In production, integrate with:
- MongoDB
- PostgreSQL
- MySQL
- Azure SQL Database

## Azure Deployment

This backend is optimized for Azure App Service deployment with:
- Automatic PORT detection
- Production-ready logging
- CORS configured for custom domains
- Health check endpoint for monitoring
