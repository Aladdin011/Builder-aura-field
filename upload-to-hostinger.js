import ftp from 'basic-ftp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function uploadToHostinger() {
  const client = new ftp.Client()
  client.ftp.verbose = true // Enable verbose logging

  try {
    console.log('🚀 Starting upload to Hostinger...')
    
    // FTP Configuration from environment variables
    const config = {
      host: process.env.VITE_FTP_HOST,
      user: process.env.VITE_FTP_USERNAME,
      password: process.env.VITE_FTP_PASSWORD,
      port: parseInt(process.env.VITE_FTP_PORT) || 21,
      secure: false // Set to true if using FTPS
    }

    // Validate configuration
    if (!config.host || !config.user || !config.password) {
      console.error('❌ Missing FTP credentials in .env file')
      console.log('Please add your Hostinger FTP credentials to .env:')
      console.log('VITE_FTP_HOST=your-ftp-host.com')
      console.log('VITE_FTP_USERNAME=your-ftp-username')
      console.log('VITE_FTP_PASSWORD=your-ftp-password')
      return
    }

    console.log(`📡 Connecting to ${config.host}...`)
    console.log(`👤 Username: ${config.user}`)
    console.log(`🔑 Password: ${config.password.substring(0, 3)}***`)
    
    await client.access(config)

    // Navigate to the remote directory
    const remotePath = process.env.VITE_FTP_REMOTE_PATH || 'public_html'
    console.log(`📁 Navigating to remote directory: ${remotePath}`)
    await client.ensureDir(remotePath)
    await client.cd(remotePath)

    // Upload the dist folder contents
    const localPath = path.join(__dirname, 'dist')
    
    if (!fs.existsSync(localPath)) {
      console.error('❌ dist folder not found. Please run "npm run build" first.')
      return
    }

    console.log('📤 Uploading files...')
    await client.uploadFromDir(localPath)

    console.log('✅ Upload completed successfully!')
    console.log(`🌐 Your site should be available at: https://jdmarcng.com`)

  } catch (err) {
    console.error('❌ Upload failed:', err.message)
    
    if (err.code === 'ECONNREFUSED') {
      console.log('💡 Make sure your FTP credentials are correct and the server is accessible.')
    } else if (err.code === 'EAUTH') {
      console.log('💡 Check your username and password.')
    } else if (err.message.includes('530 Login incorrect')) {
      console.log('💡 FTP Login failed. Please check:')
      console.log('   - Username is correct')
      console.log('   - Password is correct')
      console.log('   - Special characters in password are properly escaped')
      console.log('   - Try using the full domain as username: u158969833.jdmarcng.com')
    }
  }

  client.close()
}

// Run the upload
uploadToHostinger()