#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🖼️  Image Optimization Script');
console.log('============================');

// Check if Sharp is available for WebP conversion
let sharp;
try {
  sharp = await import('sharp');
  console.log('✅ Sharp library available for WebP conversion');
} catch (error) {
  console.log('📝 Sharp not available. Install with: npm install sharp --save-dev');
  console.log('💡 For now, the existing JPEG logos will continue to work fine.');
  process.exit(0);
}

const imagePath = path.join(__dirname, '..', 'public', 'images', 'brand');

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp.default(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   Size: ${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB (${savings}% smaller)`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
  }
}

async function main() {
  const logoPath = path.join(imagePath, 'logo.jpg');
  const logoDarkPath = path.join(imagePath, 'logo-dark.jpg');
  
  if (fs.existsSync(logoPath)) {
    await optimizeImage(logoPath, path.join(imagePath, 'logo.webp'));
  }
  
  if (fs.existsSync(logoDarkPath)) {
    await optimizeImage(logoDarkPath, path.join(imagePath, 'logo-dark.webp'));
  }
  
  console.log('\n🎉 Image optimization complete!');
  console.log('💡 Update your components to use .webp files with .jpg fallbacks for maximum compatibility.');
}

main().catch(console.error);
