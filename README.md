# Grocery Management Backend

A Node.js/Express backend API for grocery management system.

## Features

- User authentication with JWT
- Product management
- Category management
- User profile management
- MongoDB database integration

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/grocery-management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRATION=1h
   FRONTEND_URL=http://localhost:3002
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Railway Deployment

This project is configured for Railway deployment. Follow these steps:

### 1. Connect to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize project: `railway init`

### 2. Set Environment Variables

In Railway dashboard, set these environment variables:

- `MONGODB_URI`: Your MongoDB connection string (Railway can provide MongoDB)
- `JWT_SECRET`: A secure random string for JWT signing
- `JWT_EXPIRATION`: JWT token expiration time (default: 1h)
- `FRONTEND_URL`: Your frontend application URL

### 3. Deploy

```bash
railway up
```

### 4. Health Check

The API includes a health check endpoint at `/api/health` that Railway uses for monitoring.

## API Endpoints

- `GET /api/health` - Health check
- Authentication routes: `/api/auth/*`
- Profile routes: `/api/profile/*`
- Product routes: `/api/products/*`
- Category routes: `/api/categories/*`

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRATION` | JWT token expiration | No | 1h |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3002 |

## Dependencies

- Express.js - Web framework
- Mongoose - MongoDB ODM
- JWT - Authentication
- CORS - Cross-origin resource sharing
- dotenv - Environment variables 