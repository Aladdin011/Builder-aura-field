# Railway Deployment Guide - JD Marc Backend

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Railway Platform Overview](#railway-platform-overview)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Custom Domain Setup](#custom-domain-setup)
- [Monitoring & Logs](#monitoring--logs)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🚀 Prerequisites

### Required Accounts & Tools
- ✅ **GitHub Account**: Your backend code repository
- ✅ **Railway Account**: Sign up at [railway.app](https://railway.app)
- ✅ **Domain Name**: (Optional) Custom domain for your API
- ✅ **Node.js**: Version 18+ for local development

### Project Requirements
- ✅ **Package.json**: With proper build and start scripts
- �� **Environment Variables**: Defined and documented
- ✅ **Database Configuration**: Prisma schema setup
- ✅ **Port Configuration**: Express app configured for Railway

## 🚂 Railway Platform Overview

### What is Railway?
Railway is a modern cloud platform that simplifies deployment for developers. It offers:

- **Git-based Deployments**: Automatic deployments from GitHub
- **Built-in Databases**: PostgreSQL, MySQL, Redis, MongoDB
- **Environment Management**: Easy configuration of environment variables
- **Monitoring**: Built-in logging and metrics
- **Scaling**: Automatic scaling based on demand

### Railway Benefits for Your Project
- **Zero DevOps**: No server management required
- **Automatic SSL**: HTTPS certificates included
- **Preview Environments**: Branch-based deployments
- **Cost Effective**: Pay-as-you-use pricing model

## 📚 Step-by-Step Deployment

### Step 1: Prepare Your Backend Code

First, ensure your backend is properly configured for Railway deployment.

#### 1.1 Update `package.json` Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "postinstall": "prisma generate"
  }
}
```

#### 1.2 Configure Port for Railway
Update your `server.ts` file:
```typescript
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 1.3 Add Railway-specific Files
Create `railway.toml` in your backend root:
```toml
[build]
  builder = "NIXPACKS"

[deploy]
  startCommand = "npm start"
  healthcheckPath = "/health"
  healthcheckTimeout = 300
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 10
```

### Step 2: Create Railway Account

#### 2.1 Sign Up
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended for easy integration)
4. Verify your email address

#### 2.2 Initial Dashboard
Once logged in, you'll see the Railway dashboard with options to:
- Deploy from GitHub repo
- Deploy from template
- Create empty project

### Step 3: Connect Your GitHub Repository

#### 3.1 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your JD Marc backend repository
4. Railway will automatically detect it's a Node.js project

#### 3.2 Configure Build Settings
Railway will auto-detect your build configuration, but verify:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher

### Step 4: Set Up Database

#### 4.1 Add PostgreSQL Database
1. In your Railway project dashboard
2. Click **"New Service"** → **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Note the database connection details

#### 4.2 Configure Database Connection
Railway automatically provides these environment variables:
- `DATABASE_URL`: Complete PostgreSQL connection string
- `PGHOST`: Database host
- `PGPORT`: Database port
- `PGUSER`: Database username
- `PGPASSWORD`: Database password
- `PGDATABASE`: Database name

### Step 5: Environment Variables Configuration

#### 5.1 Access Environment Variables
1. Go to your project dashboard
2. Click on your service
3. Navigate to **"Variables"** tab
4. Add your environment variables

#### 5.2 Required Environment Variables
Add these variables one by one:

```bash
# Database (automatically provided by Railway)
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# API Configuration
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com

# Email Configuration (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Analytics (if using)
GA_TRACKING_ID=G-XXXXXXXXXX

# File Upload (if using)
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/uploads

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-here

# External APIs (if using)
EXTERNAL_API_KEY=your-external-api-key
WEBHOOK_SECRET=your-webhook-secret
```

#### 5.3 Setting Variables via Railway Dashboard
For each variable:
1. Click **"New Variable"**
2. Enter **Variable Name** (e.g., `JWT_SECRET`)
3. Enter **Variable Value**
4. Click **"Add"**

#### 5.4 Setting Variables via Railway CLI (Alternative)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Set environment variables
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
```

### Step 6: Deploy Your Application

#### 6.1 Trigger Deployment
1. Push your code to GitHub main branch
2. Railway automatically detects the push
3. Deployment starts automatically
4. Monitor the build logs in real-time

#### 6.2 Monitor Deployment
In the Railway dashboard:
1. Click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment to see logs
4. Watch for successful build and start messages

#### 6.3 Verify Deployment
Once deployed:
1. Note your app URL (e.g., `https://your-app.railway.app`)
2. Test basic endpoints
3. Check database connection
4. Verify environment variables are working

### Step 7: Database Migration

#### 7.1 Run Prisma Migrations
After successful deployment, run database migrations:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# Or via the Railway dashboard
# Go to your service → Settings → Commands
# Add command: npx prisma migrate deploy
```

#### 7.2 Seed Database (Optional)
If you have seed data:
```bash
railway run npm run seed
```

## 🔧 Environment Configuration

### Environment Files Structure
```
backend/
├── .env.local          # Local development
├── .env.production     # Production (don't commit)
└── .env.example        # Template for others
```

### Sample `.env.example`
```bash
# Database
DATABASE_URL="postgresql://localhost:5432/jdmarc_dev"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server Configuration
NODE_ENV="development"
PORT=3000

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Best Practices
- ✅ **Never commit** `.env` files to Git
- ✅ **Use strong secrets** (minimum 32 characters)
- ✅ **Rotate secrets** regularly
- ✅ **Limit CORS origins** to your frontend domain
- ✅ **Use HTTPS** in production

## 🗄️ Database Setup

### PostgreSQL Configuration

#### Database Connection
Railway provides a managed PostgreSQL instance with:
- **Automatic backups**: Daily snapshots
- **Connection pooling**: Built-in optimization
- **SSL encryption**: Secure connections
- **Monitoring**: Performance metrics

#### Prisma Configuration
Update your `schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Add your other models here
```

#### Migration Commands
```bash
# Generate Prisma client
railway run npx prisma generate

# Deploy migrations
railway run npx prisma migrate deploy

# Reset database (development only)
railway run npx prisma migrate reset

# View database
railway run npx prisma studio
```

### Database Monitoring
Railway provides built-in monitoring:
1. Go to your database service
2. Click **"Metrics"** tab
3. Monitor:
   - Connection count
   - Query performance
   - Storage usage
   - Memory usage

## 🌐 Custom Domain Setup

### Adding Custom Domain

#### Step 1: Configure Domain in Railway
1. Go to your service dashboard
2. Click **"Settings"** tab
3. Scroll to **"Domains"** section
4. Click **"Custom Domain"**
5. Enter your domain (e.g., `api.jdmarc.com`)

#### Step 2: Configure DNS
Add a CNAME record in your DNS provider:
```
Type: CNAME
Name: api (or your subdomain)
Value: your-app.railway.app
TTL: 300 (or default)
```

#### Step 3: SSL Certificate
Railway automatically provisions SSL certificates via Let's Encrypt:
- **Automatic renewal**: Certificates auto-renew
- **No configuration needed**: Works out of the box
- **Multiple domains**: Support for multiple custom domains

### Frontend Integration
Update your frontend to use the custom domain:
```typescript
// src/services/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.jdmarc.com'
  : 'http://localhost:3000';
```

## 📊 Monitoring & Logs

### Railway Monitoring Dashboard

#### Real-time Logs
1. Go to your service
2. Click **"Logs"** tab
3. View real-time application logs
4. Filter by log level (info, warning, error)

#### Performance Metrics
Monitor key metrics:
- **CPU Usage**: Track application performance
- **Memory Usage**: Monitor memory consumption
- **Network I/O**: Track request/response data
- **Request Count**: Monitor traffic patterns

#### Health Checks
Configure health check endpoint:
```typescript
// Add to your Express app
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
});
```

### Log Management

#### Structured Logging
Use Winston for structured logging:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Usage
logger.info('Server started', { port: PORT });
logger.error('Database error', { error: error.message });
```

#### Log Retention
Railway keeps logs for:
- **Hobby Plan**: 7 days
- **Pro Plan**: 30 days
- **Team Plan**: 90 days

### Alerting

#### Set Up Alerts
1. Go to **"Settings"** → **"Alerts"**
2. Configure alerts for:
   - High CPU usage (>80%)
   - High memory usage (>90%)
   - Error rate threshold
   - Response time threshold

#### Notification Channels
- **Email**: Instant email notifications
- **Slack**: Integrate with Slack channels
- **Discord**: Discord webhook integration
- **Webhook**: Custom webhook endpoints

## 🛠️ Troubleshooting

### Common Deployment Issues

#### Issue 1: Build Failures
**Problem**: Build fails with dependency errors
```bash
Solution:
1. Check package.json dependencies
2. Verify Node.js version compatibility
3. Clear build cache: railway run npm ci
```

#### Issue 2: Database Connection Errors
**Problem**: Cannot connect to database
```bash
Solution:
1. Verify DATABASE_URL format
2. Check Prisma schema configuration
3. Run: railway run npx prisma generate
```

#### Issue 3: Port Binding Issues
**Problem**: Application not accessible
```typescript
// Ensure your app binds to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Issue 4: Environment Variable Issues
**Problem**: Environment variables not working
```bash
Solution:
1. Check variable names (case-sensitive)
2. Verify values are properly set
3. Restart service after changes
```

### Debug Commands

#### Check Service Status
```bash
railway status
```

#### View Recent Logs
```bash
railway logs --tail 100
```

#### Connect to Database
```bash
railway connect postgres
```

#### Run Commands in Production
```bash
railway run npx prisma migrate status
railway run npm run seed
```

### Performance Optimization

#### Memory Optimization
```typescript
// Add to your app
process.on('warning', (warning) => {
  console.warn(warning.stack);
});

// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB'
  });
}, 30000);
```

#### Database Query Optimization
```typescript
// Use Prisma query optimization
const users = await prisma.user.findMany({
  select: { id: true, email: true }, // Only select needed fields
  take: 20, // Limit results
  skip: offset, // Pagination
  where: { active: true } // Efficient filtering
});
```

## ✅ Best Practices

### Deployment Best Practices

#### 1. Use Git Branches
```bash
# Development branch
git checkout -b feature/new-api-endpoint

# Production branch
git checkout main
git merge feature/new-api-endpoint
```

#### 2. Environment Separation
- **Development**: Use Railway preview environments
- **Staging**: Deploy from staging branch
- **Production**: Deploy from main branch only

#### 3. Database Migrations
```bash
# Always backup before migrations
railway run pg_dump DATABASE_URL > backup.sql

# Run migrations
railway run npx prisma migrate deploy

# Verify migration success
railway run npx prisma migrate status
```

#### 4. Secret Management
- Use Railway's built-in secret management
- Rotate secrets regularly
- Never log sensitive information
- Use different secrets for different environments

### Monitoring Best Practices

#### 1. Health Checks
Implement comprehensive health checks:
```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'running'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### 2. Structured Logging
```typescript
// Log important events
logger.info('User login', { userId, ip: req.ip });
logger.warn('Rate limit exceeded', { ip: req.ip });
logger.error('Database error', { error: error.stack });
```

#### 3. Performance Monitoring
```typescript
// Track API performance
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});
```

### Security Best Practices

#### 1. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

#### 2. CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### 3. Input Validation
```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/contact',
  body('email').isEmail(),
  body('message').isLength({ min: 10 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Code is tested locally
- [ ] Environment variables documented
- [ ] Database schema is finalized
- [ ] Security configurations reviewed
- [ ] Performance optimization completed

### During Deployment
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Database service created
- [ ] Health check endpoint working
- [ ] SSL certificate provisioned

### Post-Deployment
- [ ] API endpoints tested
- [ ] Database migrations successful
- [ ] Monitoring and alerts configured
- [ ] Custom domain configured (if applicable)
- [ ] Frontend integration verified
- [ ] Performance metrics baseline established

## 📞 Support and Resources

### Railway Resources
- **Documentation**: [docs.railway.app](https://docs.railway.app)
- **Community**: [Railway Discord](https://discord.gg/railway)
- **Status Page**: [status.railway.app](https://status.railway.app)
- **Pricing**: [railway.app/pricing](https://railway.app/pricing)

### Additional Help
- **Railway Support**: Available via dashboard
- **GitHub Issues**: Report bugs and feature requests
- **Community Forums**: Ask questions and share solutions

---

*This guide provides comprehensive instructions for deploying your JD Marc Limited backend to Railway. Follow these steps carefully for a successful deployment.*
