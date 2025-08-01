import ftp from 'basic-ftp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function deployToHostinger() {
  console.log('🚀 JD Marc Construction - Hostinger Deployment')
  console.log('===============================================\n')

  // Step 1: Verify build exists
  const distPath = path.join(__dirname, 'dist')
  if (!fs.existsSync(distPath)) {
    console.error('❌ Build folder not found!')
    console.log('💡 Please run "npm run build" first to generate the dist folder.')
    process.exit(1)
  }

  // Step 2: FTP Configuration
  const ftpConfig = {
    host: process.env.VITE_FTP_HOST || '46.202.183.111',
    user: process.env.VITE_FTP_USERNAME || 'u158969833.jdmarcng.com',
    password: process.env.VITE_FTP_PASSWORD || 'Error@404',
    port: parseInt(process.env.VITE_FTP_PORT) || 21,
    secure: false
  }

  console.log('📋 Deployment Configuration:')
  console.log(`   🌐 Host: ${ftpConfig.host}`)
  console.log(`   👤 User: ${ftpConfig.user}`)
  console.log(`   🔐 Pass: ${ftpConfig.password.substring(0, 3)}***`)
  console.log(`   🔌 Port: ${ftpConfig.port}`)
  console.log()

  const client = new ftp.Client()
  client.ftp.verbose = false // Reduce noise

  try {
    console.log('🔗 Connecting to Hostinger FTP server...')
    
    // Try connection with timeout
    await Promise.race([
      client.access(ftpConfig),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 30000)
      )
    ])

    console.log('✅ Connected successfully!')

    // Step 3: Navigate to web directory
    const remotePath = process.env.VITE_FTP_REMOTE_PATH || 'public_html'
    console.log(`📁 Navigating to ${remotePath}...`)
    
    try {
      await client.cd(remotePath)
      console.log('✅ Directory found')
    } catch (error) {
      console.log('📂 Creating directory...')
      await client.ensureDir(remotePath)
      await client.cd(remotePath)
    }

    // Step 4: Get current directory listing
    console.log('📄 Checking remote directory...')
    const remoteFiles = await client.list()
    
    if (remoteFiles.length > 0) {
      console.log(`📋 Found ${remoteFiles.length} existing files:`)
      remoteFiles.slice(0, 5).forEach(file => {
        console.log(`   - ${file.name} (${file.size} bytes)`)
      })
      if (remoteFiles.length > 5) {
        console.log(`   ... and ${remoteFiles.length - 5} more files`)
      }
    }

    // Step 5: Upload files
    console.log('\n📤 Starting file upload...')
    console.log('⏳ This may take a few minutes for the first deployment...')
    
    const startTime = Date.now()
    
    // Upload directory contents
    await client.uploadFromDir(distPath)
    
    const uploadTime = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`✅ Upload completed in ${uploadTime} seconds!`)

    // Step 6: Verify upload
    console.log('\n🔍 Verifying deployment...')
    const uploadedFiles = await client.list()
    
    const expectedFiles = ['index.html', 'assets', 'favicon.ico']
    const foundFiles = uploadedFiles.map(f => f.name)
    
    let allGood = true
    expectedFiles.forEach(expected => {
      if (foundFiles.includes(expected)) {
        console.log(`✅ ${expected} - uploaded`)
      } else {
        console.log(`❌ ${expected} - missing`)
        allGood = false
      }
    })

    if (allGood) {
      console.log('\n🎉 DEPLOYMENT SUCCESSFUL!')
      console.log('===============================')
      console.log(`🌐 Your website is now live at: https://jdmarcng.com`)
      console.log(`📊 Files uploaded: ${uploadedFiles.length}`)
      console.log(`⏱️  Total time: ${uploadTime}s`)
      console.log()
      console.log('🚀 Next steps:')
      console.log('   1. Visit https://jdmarcng.com to see your site')
      console.log('   2. Test all pages and functionality')
      console.log('   3. Check mobile responsiveness')
      console.log('   4. Verify contact forms work properly')
    } else {
      console.log('\n⚠️  DEPLOYMENT COMPLETED WITH ISSUES')
      console.log('Some files may not have uploaded correctly.')
      console.log('Please check the website manually.')
    }

  } catch (error) {
    console.error('\n❌ DEPLOYMENT FAILED')
    console.error('====================')
    
    if (error.message.includes('530 Login incorrect')) {
      console.log('\n🔐 Authentication Error:')
      console.log('   The FTP credentials are incorrect.')
      console.log('\n💡 Please check:')
      console.log('   1. Username is exactly: u158969833.jdmarcng.com')
      console.log('   2. Password is correct (case-sensitive)')
      console.log('   3. FTP service is enabled in Hostinger control panel')
      console.log('\n🛠️  To fix:')
      console.log('   1. Login to your Hostinger control panel')
      console.log('   2. Go to Files > FTP Accounts')
      console.log('   3. Verify or reset your FTP password')
      console.log('   4. Update the .env file with correct credentials')
      
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.log('\n🌐 Connection Error:')
      console.log('   Cannot connect to FTP server.')
      console.log('\n💡 Please check:')
      console.log('   1. Internet connection is stable')
      console.log('   2. FTP host is correct: 46.202.183.111')
      console.log('   3. Port 21 is not blocked by firewall')
      console.log('   4. Try again in a few minutes')
      
    } else {
      console.log(`\n❓ Unknown Error: ${error.message}`)
      console.log('\n💡 Troubleshooting:')
      console.log('   1. Check .env file for correct FTP credentials')
      console.log('   2. Verify Hostinger FTP service is active')
      console.log('   3. Try manual FTP client (FileZilla) to test credentials')
    }
    
    console.log('\n📞 Need help?')
    console.log('   - Check Hostinger knowledge base')
    console.log('   - Contact Hostinger support')
    console.log('   - Verify FTP credentials in control panel')
    
  } finally {
    console.log('\n🔌 Closing FTP connection...')
    client.close()
  }
}

// Run deployment
deployToHostinger().catch(console.error)
