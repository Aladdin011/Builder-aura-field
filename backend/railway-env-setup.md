# Railway Environment Variables Setup

## Required Environment Variables for Railway Deployment

### 1. Database (Railway will auto-generate this)
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

### 2. JWT Configuration (Generate secure random strings)
```
JWT_SECRET=your-256-bit-secure-random-string-here
JWT_REFRESH_SECRET=your-256-bit-secure-refresh-string-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Frontend URL (Your Railway frontend domain)
```
FRONTEND_URL=https://your-frontend-domain.railway.app
```

### 4. Email Configuration (Choose one provider)

#### Option A: Gmail
```
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@jdmarc.com
```

#### Option B: SendGrid
```
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
ADMIN_EMAIL=admin@jdmarc.com
```

### 5. Production Settings
```
NODE_ENV=production
PORT=5000
TRUST_PROXY=true
```

## How to Generate JWT Secrets

Run these commands locally to generate secure secrets:

```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For JWT_REFRESH_SECRET  
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Gmail App Password Setup

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use the 16-character password as GMAIL_APP_PASSWORD