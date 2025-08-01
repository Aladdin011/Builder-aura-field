#!/bin/bash

echo "🚀 Starting FTP upload to Hostinger..."

# FTP credentials
FTP_HOST="46.202.183.111"
FTP_USER="u158969833.jdmarcng.com"
FTP_PASS="Error@404"
FTP_PORT="21"

# Create FTP commands file
cat > ftp-commands.txt << EOF
open $FTP_HOST $FTP_PORT
user $FTP_USER $FTP_PASS
binary
cd public_html
lcd dist
put index.html
put favicon.ico
put robots.txt
put placeholder.svg
mput assets/*
mput images/*
bye
EOF

echo "📤 Uploading files..."
ftp -n < ftp-commands.txt

echo "✅ Upload completed!"
echo "🌐 Your site should be available at: https://jdmarcng.com"

# Clean up
rm ftp-commands.txt