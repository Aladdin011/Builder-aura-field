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

    // FTP Configuration from environment variables - try multiple formats
    const configs = [
      // Try with full domain username first
      {
        host: process.env.VITE_FTP_HOST,
        user: process.env.VITE_FTP_USERNAME,
        password: process.env.VITE_FTP_PASSWORD,
        port: parseInt(process.env.VITE_FTP_PORT) || 21,
        secure: false
      },
      // Try with just the user part before the dot
      {
        host: process.env.VITE_FTP_HOST,
        user: process.env.VITE_FTP_USERNAME?.split('.')[0] || process.env.VITE_FTP_USERNAME,
        password: process.env.VITE_FTP_PASSWORD,
        port: parseInt(process.env.VITE_FTP_PORT) || 21,
        secure: false
      }
    ]

    // Validate configuration
    if (!configs[0].host || !configs[0].user || !configs[0].password) {
      console.error('❌ Missing FTP credentials in .env file')
      console.log('Please add your Hostinger FTP credentials to .env:')
      console.log('VITE_FTP_HOST=your-ftp-host.com')
      console.log('VITE_FTP_USERNAME=your-ftp-username')
      console.log('VITE_FTP_PASSWORD=your-ftp-password')
      return
    }

    let connected = false
    let config = null

    // Try different authentication methods
    for (let i = 0; i < configs.length && !connected; i++) {
      config = configs[i]
      console.log(`📡 Attempt ${i + 1}: Connecting to ${config.host}...`)
      console.log(`👤 Username: ${config.user}`)
      console.log(`🔑 Password: ${config.password.substring(0, 3)}***`)

      try {
        await client.access(config)
        connected = true
        console.log('✅ Connected successfully!')
      } catch (authError) {
        console.log(`❌ Attempt ${i + 1} failed: ${authError.message}`)
        if (i < configs.length - 1) {
          console.log('🔄 Trying alternative credentials...')
          client.close()
          // Create new client for next attempt
          const newClient = new ftp.Client()
          newClient.ftp.verbose = true
          Object.assign(client, newClient)
        }
      }
    }

    if (!connected) {
      throw new Error('All authentication attempts failed')
    }

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
