#!/usr/bin/env node

import { FTP } from "basic-ftp";
import dotenv from "dotenv";

dotenv.config();

async function troubleshootFTP() {
  console.log("🔍 JD Marc Construction - FTP Troubleshooter");
  console.log("==============================================\n");

  const password = process.env.VITE_FTP_PASSWORD || "eJ]]e$F[erfKak;0";

  const testConfigs = [
    {
      name: "Config 1: Domain host + Simple username",
      host: "ftp.jdmarcng.com",
      user: "JDM",
      password: password,
      port: 21,
    },
    {
      name: "Config 2: Domain host + Full username",
      host: "ftp.jdmarcng.com",
      user: "u158969833.jdmarcng.com",
      password: password,
      port: 21,
    },
    {
      name: "Config 3: IP host + Simple username",
      host: "46.202.183.111",
      user: "JDM",
      password: password,
      port: 21,
    },
    {
      name: "Config 4: IP host + Full username",
      host: "46.202.183.111",
      user: "u158969833.jdmarcng.com",
      password: password,
      port: 21,
    },
    {
      name: "Config 5: Domain host + User with @",
      host: "ftp.jdmarcng.com",
      user: "JDM@jdmarcng.com",
      password: password,
      port: 21,
    },
    {
      name: "Config 6: SFTP port test",
      host: "ftp.jdmarcng.com",
      user: "u158969833.jdmarcng.com",
      password: password,
      port: 22,
    },
  ];

  let successFound = false;

  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    console.log(`\n📋 Testing ${config.name}`);
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Pass: ${config.password.substring(0, 4)}***`);
    console.log(`   Port: ${config.port}`);

    const client = new FTP();
    client.ftp.verbose = false;

    try {
      // Set timeout for each attempt
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout (15s)")), 15000),
      );

      await Promise.race([
        client.access({
          host: config.host,
          user: config.user,
          password: config.password,
          port: config.port,
          secure: config.port === 22 ? true : false,
        }),
        timeout,
      ]);

      console.log("   ✅ SUCCESS: Authentication worked!");

      // Test directory access
      try {
        const list = await client.list();
        console.log(`   📁 Root directory has ${list.length} items`);

        // Test target directory
        const targetPath = "/home/u158969833/domains/jdmarcng.com/public_html";
        try {
          await client.cd(targetPath);
          console.log("   ✅ Target directory accessible");

          const targetList = await client.list();
          console.log(`   📁 Target directory has ${targetList.length} items`);

          // Show some files if any
          if (targetList.length > 0) {
            console.log("   📄 Files found:");
            targetList.slice(0, 3).forEach((file) => {
              console.log(`      - ${file.name}`);
            });
          }
        } catch (cdError) {
          console.log(
            `   ⚠️  Cannot access target directory: ${cdError.message}`,
          );

          // Try alternative paths
          const altPaths = ["public_html", "www", "htdocs"];
          for (const altPath of altPaths) {
            try {
              await client.cd(`/${altPath}`);
              console.log(`   ✅ Alternative path works: /${altPath}`);
              break;
            } catch {
              // Try next path
            }
          }
        }
      } catch (listError) {
        console.log(`   ⚠️  Cannot list directory: ${listError.message}`);
      }

      successFound = true;
      await client.close();

      console.log("\n🎉 WORKING CONFIGURATION FOUND!");
      console.log("================================");
      console.log("Update your .env file with these settings:");
      console.log(`VITE_FTP_HOST=${config.host}`);
      console.log(`VITE_FTP_USERNAME=${config.user}`);
      console.log(`VITE_FTP_PASSWORD=${config.password}`);
      console.log(`VITE_FTP_PORT=${config.port}`);
      console.log("");

      break;
    } catch (error) {
      if (error.message.includes("530")) {
        console.log("   ❌ Authentication failed - wrong credentials");
      } else if (error.message.includes("timeout")) {
        console.log("   ❌ Connection timeout - host/port may be wrong");
      } else if (error.message.includes("ECONNREFUSED")) {
        console.log("   ❌ Connection refused - service may be down");
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }

    // Small delay between attempts
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (!successFound) {
    console.log("\n🚨 NO WORKING CONFIGURATION FOUND");
    console.log("==================================");
    console.log("");
    console.log("📋 Troubleshooting Steps:");
    console.log("1. Login to Hostinger control panel");
    console.log("2. Go to Websites > Manage > Files > FTP Accounts");
    console.log("3. Check if FTP service is enabled");
    console.log("4. Verify the exact username format");
    console.log("5. Try resetting the password");
    console.log("6. Check if there are any IP restrictions");
    console.log("");
    console.log("📞 Contact Hostinger Support:");
    console.log("- Live chat in control panel");
    console.log("- Mention FTP connection issues");
    console.log("- Ask them to verify FTP account settings");
  }
}

troubleshootFTP().catch(console.error);
