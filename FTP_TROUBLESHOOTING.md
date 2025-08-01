# Hostinger FTP Deployment Troubleshooting Guide

## Current Status
❌ **Deployment Failed**: Authentication Error (530 Login incorrect)

## Your Provided Credentials
- **Host**: ftp.jdmarcng.com
- **Username**: u158969833.JDM
- **Directory**: /home/u158969833/domains/jdmarcng.com/public_html
- **Current Password**: Error@404

## Step-by-Step Fix

### 1. Verify FTP Credentials in Hostinger Control Panel

1. **Login to Hostinger Control Panel**
   - Go to: https://hpanel.hostinger.com/
   - Login with your account credentials

2. **Navigate to FTP Accounts**
   - Click on **"Websites"** in the sidebar
   - Select your domain: **jdmarcng.com**
   - Click on **"Files"** → **"FTP Accounts"**

3. **Check Your FTP Account**
   - Look for the FTP account: `u158969833.JDM@jdmarcng.com`
   - Note the exact username format shown in the panel

### 2. Common Username Format Issues

The username might be in one of these formats:
- `u158969833.JDM`
- `u158969833.jdmarcng.com`
- `u158969833.JDM@jdmarcng.com`

### 3. Reset FTP Password

If the password is incorrect:

1. **In FTP Accounts section**:
   - Find your FTP account
   - Click **"Manage"** or **"Edit"** next to the account
   - Click **"Change Password"**
   - Set a new password (use something simple like `NewPass123!`)
   - Save the changes

### 4. Update Environment Variables

Once you have the correct credentials, update the `.env` file:

```bash
VITE_FTP_HOST=ftp.jdmarcng.com
VITE_FTP_USERNAME=[exact_username_from_panel]
VITE_FTP_PASSWORD=[new_password_you_set]
VITE_FTP_PORT=21
VITE_FTP_REMOTE_PATH=/home/u158969833/domains/jdmarcng.com/public_html
```

### 5. Test Connection

After updating credentials, run:
```bash
npm run deploy:hostinger
```

## Alternative Connection Methods

### Option 1: Try Different Host
Some Hostinger accounts use different FTP hosts:
- `ftp.jdmarcng.com`
- `46.202.183.111` (IP address)
- `files.000webhost.com` (for some free accounts)

### Option 2: Check FTP Service Status
1. In Hostinger control panel
2. Go to **"Websites"** → **"Manage"**
3. Check if FTP service is enabled

### Option 3: Create New FTP Account
If the current account has issues:
1. Go to **"Files"** → **"FTP Accounts"**
2. Click **"Create FTP Account"**
3. Create a new account with simple credentials
4. Use the new account for deployment

## Testing Credentials Manually

You can test FTP credentials using FileZilla or any FTP client:

**FileZilla Settings**:
- Host: `ftp.jdmarcng.com`
- Username: `[your_exact_username]`
- Password: `[your_password]`
- Port: `21`
- Protocol: `FTP (not SFTP)`

## Common Issues and Solutions

### Issue: "530 Login incorrect"
- **Cause**: Wrong username or password
- **Solution**: Verify exact credentials in Hostinger panel

### Issue: "Connection timeout"
- **Cause**: Wrong host or port blocked
- **Solution**: Try IP address instead of hostname

### Issue: "Directory not found"
- **Cause**: Wrong remote path
- **Solution**: Use the path shown in Hostinger panel

## Next Steps

1. **Login to Hostinger control panel**
2. **Find the exact FTP username format**
3. **Reset the password to something simple**
4. **Update the `.env` file with correct credentials**
5. **Run `npm run deploy:hostinger` again**

## Need Additional Help?

If you continue having issues:
1. Take a screenshot of your FTP account settings in Hostinger
2. Try creating a new FTP account
3. Contact Hostinger support for FTP assistance

## Contact Information

**Hostinger Support**:
- Live Chat: Available in your control panel
- Help Center: https://support.hostinger.com/
- Knowledge Base: Search for "FTP setup"

---

**Note**: The most common issue is incorrect username format or password. The exact format must match what's shown in your Hostinger control panel.
