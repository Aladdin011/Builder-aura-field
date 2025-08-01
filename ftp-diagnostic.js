#!/usr/bin/env node

import { FTP } from 'basic-ftp';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function diagnoseFTPConnection() {
    console.log('🔍 FTP Connection Diagnostic');
    console.log('============================\n');
    
    const configs = [
        {
            name: 'Current Configuration',
            host: process.env.VITE_FTP_HOST,
            user: process.env.VITE_FTP_USERNAME,
            password: process.env.VITE_FTP_PASSWORD,
            port: parseInt(process.env.VITE_FTP_PORT) || 21
        },
        {
            name: 'Alternative Username Format',
            host: process.env.VITE_FTP_HOST,
            user: 'u158969833.jdmarcng.com',
            password: process.env.VITE_FTP_PASSWORD,
            port: parseInt(process.env.VITE_FTP_PORT) || 21
        }
    ];
    
    for (const config of configs) {
        console.log(`📋 Testing: ${config.name}`);
        console.log(`   Host: ${config.host}`);
        console.log(`   User: ${config.user}`);
        console.log(`   Pass: ${config.password?.substring(0, 3)}***`);
        console.log(`   Port: ${config.port}\n`);
        
        const client = new FTP();
        client.ftp.verbose = false;
        
        try {
            await client.access({
                host: config.host,
                user: config.user,
                password: config.password,
                port: config.port,
                secure: false
            });
            
            console.log('✅ SUCCESS: Connection established!');
            
            // Test listing directory
            try {
                const list = await client.list();
                console.log(`   📁 Found ${list.length} items in root directory`);
                
                // Try to access the target directory
                try {
                    await client.cd('/home/u158969833/domains/jdmarcng.com/public_html');
                    console.log('   ✅ Target directory accessible');
                    
                    const targetList = await client.list();
                    console.log(`   📁 Found ${targetList.length} items in target directory`);
                } catch (cdError) {
                    console.log('   ⚠️  Target directory not accessible:', cdError.message);
                }
                
            } catch (listError) {
                console.log('   ⚠️  Could not list directory:', listError.message);
            }
            
            await client.close();
            console.log('   🔌 Connection closed\n');
            return; // Success, exit
            
        } catch (error) {
            console.log(`❌ FAILED: ${error.message}\n`);
        }
    }
    
    console.log('💡 Troubleshooting Steps:');
    console.log('1. Verify FTP credentials in Hostinger control panel');
    console.log('2. Check if FTP service is enabled');
    console.log('3. Try resetting the FTP password');
    console.log('4. Ensure the domain is properly configured');
    console.log('5. Contact Hostinger support if issues persist');
}

diagnoseFTPConnection().catch(console.error);
