#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 JD Marc Construction - Build & Package Script");
console.log("================================================\n");

// Step 1: Clean previous build
console.log("1️⃣ Cleaning previous build...");
if (fs.existsSync("./dist")) {
  console.log("   → Removing existing dist folder");
  fs.rmSync("./dist", { recursive: true, force: true });
}

// Step 2: Install dependencies if needed
console.log("\n2️⃣ Checking dependencies...");
if (!fs.existsSync("./node_modules")) {
  console.log("   → Installing dependencies...");
  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("   ✅ Dependencies installed");
  } catch (error) {
    console.error("   ❌ Failed to install dependencies");
    process.exit(1);
  }
} else {
  console.log("   ✅ Dependencies already installed");
}

// Step 3: Run build
console.log("\n3️⃣ Building production version...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("   ✅ Build completed successfully");
} catch (error) {
  console.error("   ❌ Build failed");
  process.exit(1);
}

// Step 4: Verify build
console.log("\n4️⃣ Verifying build output...");
if (!fs.existsSync("./dist")) {
  console.error("   ❌ Dist folder not created");
  process.exit(1);
}

if (!fs.existsSync("./dist/index.html")) {
  console.error("   ❌ index.html not found in dist");
  process.exit(1);
}

console.log("   ✅ Build verification passed");

// Step 5: Generate build info
console.log("\n5️⃣ Generating build information...");

function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  });

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const buildSize = getDirectorySize("./dist");
const buildInfo = {
  buildDate: new Date().toISOString(),
  buildSize: formatBytes(buildSize),
  buildSizeBytes: buildSize,
  project: "JD Marc Construction Platform",
  version: JSON.parse(fs.readFileSync("./package.json", "utf8")).version,
  files: [],
};

// Get all files in dist
function getAllFiles(dirPath, basePath = "") {
  const files = fs.readdirSync(dirPath);
  let fileList = [];

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const relativePath = path.join(basePath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      fileList = fileList.concat(getAllFiles(filePath, relativePath));
    } else {
      fileList.push({
        path: relativePath.replace(/\\/g, "/"),
        size: formatBytes(stats.size),
        sizeBytes: stats.size,
      });
    }
  });

  return fileList;
}

buildInfo.files = getAllFiles("./dist");

fs.writeFileSync("./build-info.json", JSON.stringify(buildInfo, null, 2));
console.log("   ✅ Build info saved to build-info.json");

// Step 6: Create deployment instructions
console.log("\n6️⃣ Creating deployment instructions...");

const deploymentInstructions = `# 🚀 JD Marc Construction - Deployment Package

## 📦 Build Information
- **Build Date**: ${buildInfo.buildDate}
- **Total Size**: ${buildInfo.buildSize}
- **Files Count**: ${buildInfo.files.length}
- **Version**: ${buildInfo.version}

## 📁 Contents
The \`dist/\` folder contains your production-ready application:

${buildInfo.files.map((file) => `- \`${file.path}\` (${file.size})`).join("\n")}

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)
Upload the \`dist/\` folder to any static hosting service:
- **Netlify**: Drag & drop the \`dist/\` folder
- **Vercel**: Connect your GitHub repo or upload manually  
- **Cloudflare Pages**: Upload via dashboard
- **GitHub Pages**: Push to gh-pages branch

### Option 2: Traditional Web Hosting
1. Upload all files from \`dist/\` to your web server's public folder
2. Configure your server for SPA routing (serve index.html for all routes)
3. Enable HTTPS and compression

### Option 3: CDN Deployment
1. Upload \`dist/\` contents to your CDN
2. Configure cache headers for static assets
3. Set up proper redirects for SPA routing

## ⚙️ Server Configuration Required

### For SPA Routing (Important!)
Your server must serve \`index.html\` for all routes that don't match static files.

**Nginx Example:**
\`\`\`nginx
location / {
    try_files $uri $uri/ /index.html;
}
\`\`\`

**Apache Example:**
\`\`\`apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
\`\`\`

## ✅ Deployment Checklist
- [ ] Upload all files from \`dist/\` folder
- [ ] Configure SPA routing on your server
- [ ] Enable HTTPS
- [ ] Test all routes work correctly
- [ ] Verify contact forms and interactions
- [ ] Check mobile responsiveness

---
*Generated on ${new Date().toLocaleString()}*
`;

fs.writeFileSync("./DEPLOYMENT_READY.md", deploymentInstructions);
console.log("   ✅ Deployment instructions saved to DEPLOYMENT_READY.md");

// Final summary
console.log("\n🎉 BUILD COMPLETE!");
console.log("==================");
console.log(`📦 Build Size: ${buildInfo.buildSize}`);
console.log(`📄 Files: ${buildInfo.files.length}`);
console.log(`📁 Location: ./dist/`);
console.log("\n📋 Next Steps:");
console.log('1. Check the "./dist/" folder for your production files');
console.log('2. Read "./DEPLOYMENT_READY.md" for deployment instructions');
console.log("3. Upload the dist folder contents to your hosting provider");
console.log("\n✨ Your JD Marc Construction platform is ready for deployment!");
