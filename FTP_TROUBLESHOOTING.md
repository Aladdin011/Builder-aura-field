# FTP Upload Troubleshooting Guide

## Current Issue
FTP login consistently fails with "530 Login incorrect" error.

## Credentials Used
- **Host**: 46.202.183.111
- **Username**: u158969833.jdmarcng.com
- **Password**: Error@404
- **Port**: 21

## Troubleshooting Steps

### 1. Verify Credentials
- Double-check the username and password in your Hostinger control panel
- Ensure there are no extra spaces or characters
- Try copying and pasting the credentials directly

### 2. Check Account Status
- Log into your Hostinger control panel
- Verify that your hosting account is active and not suspended
- Check if FTP access is enabled for your account

### 3. Alternative Username Formats
Try these username variations:
- `u158969833.jdmarcng.com`
- `u158969833`
- `jdmarcng.com`
- `u158969833_jdmarcng.com`

### 4. Alternative Password Formats
Try these password variations:
- `Error@404`
- `Error404`
- `Error@404!`
- `Error@404#`

### 5. Use FileZilla (Recommended)
Download FileZilla and try connecting manually:
1. Download FileZilla from https://filezilla-project.org/
2. Use these settings:
   - Host: 46.202.183.111
   - Username: u158969833.jdmarcng.com
   - Password: Error@404
   - Port: 21
   - Protocol: FTP
   - Encryption: Use explicit FTP over TLS if available

### 6. Contact Hostinger Support
If all else fails:
- Contact Hostinger support via live chat
- Provide them with the error message
- Ask them to verify your FTP credentials
- Request them to reset your FTP password

## Manual Upload Alternative

If FTP continues to fail, you can manually upload the files:

### Option 1: Hostinger File Manager
1. Log into Hostinger control panel
2. Go to File Manager
3. Navigate to `public_html` folder
4. Upload all files from the `dist` folder manually

### Option 2: cPanel File Manager
1. Log into cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload files manually

## Files to Upload
From the `dist` folder, upload these files and folders:
- `index.html`
- `favicon.ico`
- `robots.txt`
- `placeholder.svg`
- `assets/` (entire folder)
- `images/` (entire folder)

## Next Steps
1. Try the troubleshooting steps above
2. If successful, run the upload script again
3. If still failing, use manual upload via File Manager
4. Contact Hostinger support for assistance

## Success Indicators
- Files upload without errors
- Website is accessible at https://jdmarcng.com
- No 404 or 500 errors on the website