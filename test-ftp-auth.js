#!/usr/bin/env node

import { FTP } from "basic-ftp";

async function testFTP() {
  const client = new FTP();
  client.ftp.verbose = true; // Enable verbose logging

  console.log("🔍 Testing FTP Authentication");
  console.log("=============================\n");

  const config = {
    host: "46.202.183.111",
    user: "u158969833.jdmarcng.com",
    password: "N#P5Q2pX~u5ivA30",
    port: 21,
    secure: false,
  };

  console.log("Configuration:");
  console.log(`Host: ${config.host}`);
  console.log(`User: ${config.user}`);
  console.log(`Pass: ${config.password.substring(0, 4)}***`);
  console.log(`Port: ${config.port}\n`);

  try {
    console.log("Attempting connection...");
    await client.access(config);

    console.log("✅ SUCCESS: Connected to FTP server!");

    // Test listing
    const list = await client.list();
    console.log(`📁 Root directory contains ${list.length} items`);

    // Test navigating to public_html
    try {
      await client.cd("public_html");
      console.log("✅ Successfully accessed public_html directory");

      const publicList = await client.list();
      console.log(`📁 public_html contains ${publicList.length} items`);
    } catch (cdError) {
      console.log(`⚠️  Could not access public_html: ${cdError.message}`);
    }

    await client.close();
    console.log("🔌 Connection closed successfully");
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    console.log(`Error code: ${error.code || "Unknown"}`);
  }
}

testFTP().catch(console.error);
