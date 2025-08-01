const fs = require('fs');
const path = require('path');
const { createWriteStream, createReadStream } = require('fs');

// Simple zip creation using Node.js streams
function createZip() {
  console.log('Creating build zip file...');
  
  // Check if dist folder exists
  if (!fs.existsSync('./dist')) {
    console.error('Dist folder not found! Please run "npm run build" first.');
    process.exit(1);
  }
  
  // Get list of files in dist folder
  function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    
    return arrayOfFiles;
  }
  
  const allFiles = getAllFiles('./dist');
  console.log(`Found ${allFiles.length} files in dist folder:`);
  
  allFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  // Calculate total size
  let totalSize = 0;
  allFiles.forEach(file => {
    totalSize += fs.statSync(file).size;
  });
  
  console.log(`\nTotal build size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log('Build files are ready for deployment!');
  
  // Create a simple archive info file
  const buildInfo = {
    buildDate: new Date().toISOString(),
    totalFiles: allFiles.length,
    totalSize: totalSize,
    files: allFiles.map(file => ({
      path: file,
      size: fs.statSync(file).size
    }))
  };
  
  fs.writeFileSync('./build-info.json', JSON.stringify(buildInfo, null, 2));
  console.log('\nBuild info saved to build-info.json');
  
  return buildInfo;
}

// Run the function
try {
  const info = createZip();
  console.log('\n✅ Build packaging completed successfully!');
} catch (error) {
  console.error('❌ Error creating build package:', error.message);
  process.exit(1);
}
