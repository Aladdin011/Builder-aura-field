#!/bin/bash

echo "🚀 Starting FTP upload to Hostinger with new credentials..."

# FTP credentials
FTP_HOST="46.202.183.111"
FTP_USER="JDM"
FTP_PASS="eJ]]e\$F[erfKak;0"
FTP_PORT="21"

# Create FTP commands file
cat > ftp-commands-new.txt << EOF
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
ftp -n < ftp-commands-new.txt

echo "✅ Upload completed!"
echo "🌐 Your site should be available at: https://jdmarcng.com"

# Clean up
rm ftp-commands-new.txt