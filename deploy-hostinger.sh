#!/bin/bash

# JD Marc Limited - Hostinger Deployment Script
# This script builds and deploys the frontend to Hostinger

set -e

echo "🚀 Starting Hostinger deployment for JD Marc Limited..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HOSTINGER_SERVER="${HOSTINGER_SERVER:-your-server.com}"
HOSTINGER_USER="${HOSTINGER_USER:-your-username}"
HOSTINGER_PATH="${HOSTINGER_PATH:-/public_html}"
HOSTINGER_PORT="${HOSTINGER_PORT:-22}"

# Check if required environment variables are set
if [ -z "$HOSTINGER_SERVER" ] || [ -z "$HOSTINGER_USER" ]; then
    echo -e "${RED}❌ Error: HOSTINGER_SERVER and HOSTINGER_USER environment variables must be set${NC}"
    echo "Example: export HOSTINGER_SERVER=your-server.com"
    echo "Example: export HOSTINGER_USER=your-username"
    exit 1
fi

# Build the frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm install
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build successful${NC}"

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd dist
tar -czf ../jdmarc-frontend.tar.gz *
cd ..

# Test SSH connection
echo -e "${YELLOW}🔑 Testing SSH connection...${NC}"
ssh -p $HOSTINGER_PORT -o ConnectTimeout=10 $HOSTINGER_USER@$HOSTINGER_SERVER "echo 'SSH connection successful'" 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ SSH connection failed. Please check your credentials and server details.${NC}"
    echo "Make sure you have SSH key authentication set up or use password authentication."
    exit 1
fi

# Create backup of current deployment
echo -e "${YELLOW}💾 Creating backup of current deployment...${NC}"
ssh -p $HOSTINGER_PORT $HOSTINGER_USER@$HOSTINGER_SERVER "
    cd $HOSTINGER_PATH
    if [ -d 'current' ]; then
        mv current backup-\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
    fi
    mkdir -p current
"

# Upload the new deployment
echo -e "${YELLOW}📤 Uploading new deployment...${NC}"
scp -P $HOSTINGER_PORT jdmarc-frontend.tar.gz $HOSTINGER_USER@$HOSTINGER_SERVER:$HOSTINGER_PATH/

# Extract and deploy
echo -e "${YELLOW}🚀 Deploying application...${NC}"
ssh -p $HOSTINGER_PORT $HOSTINGER_USER@$HOSTINGER_SERVER "
    cd $HOSTINGER_PATH
    tar -xzf jdmarc-frontend.tar.gz -C current/
    rm jdmarc-frontend.tar.gz
    
    # Set proper permissions
    chmod -R 755 current/
    
    # Create .htaccess for SPA routing (if it doesn't exist)
    if [ ! -f 'current/.htaccess' ]; then
        cat > current/.htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection \"1; mode=block\"
Header always set Referrer-Policy \"strict-origin-when-cross-origin\"
Header always set Permissions-Policy \"geolocation=(), microphone=(), camera=()\"

# Cache static assets
<FilesMatch \"\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$\">
    ExpiresActive On
    ExpiresDefault \"access plus 1 year\"
    Header append Cache-Control \"public, immutable\"
</FilesMatch>

# Compress text files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF
    fi
"

# Cleanup local files
rm jdmarc-frontend.tar.gz

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "http://$HOSTINGER_SERVER" | grep -q "200"; then
    echo -e "${GREEN}✅ Deployment successful! Site is accessible at http://$HOSTINGER_SERVER${NC}"
else
    echo -e "${YELLOW}⚠️  Deployment completed but site verification failed. Please check manually.${NC}"
fi

echo -e "${GREEN}🎉 Hostinger deployment completed!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update DNS records to point to your Hostinger server"
echo "2. Configure SSL certificate in Hostinger control panel"
echo "3. Set up your backend API on a separate service (Railway, Heroku, etc.)"
echo "4. Update API URLs in your frontend environment configuration"

# Display deployment summary
echo -e "${YELLOW}📊 Deployment Summary:${NC}"
echo "• Server: $HOSTINGER_SERVER"
echo "• User: $HOSTINGER_USER"
echo "• Path: $HOSTINGER_PATH/current/"
echo "• Date: $(date)"
echo "• Status: ✅ Completed"