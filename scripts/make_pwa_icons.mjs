import fs from 'fs';
import path from 'path';

const srcFile = "C:\\Users\\mathi\\.gemini\\antigravity-ide\\brain\\a91f738a-cd23-43e4-8fbb-99032b87bf70\\thanjai_periya_kovil_app_icon_1786871152054.png";
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateExactIcons() {
  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;
    if (fs.existsSync(srcFile)) {
      await sharp(srcFile).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'icon-192.png'));
      await sharp(srcFile).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'icon-maskable-192.png'));
      await sharp(srcFile).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'icon-512.png'));
      await sharp(srcFile).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'icon-maskable-512.png'));
      await sharp(srcFile).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(publicDir, 'apple-touch-icon.png'));
      console.log('[make_pwa_icons] Generated exact 192x192 & 512x512 PNG icons using sharp!');
      return;
    }
  } catch (err) {
    console.warn('[make_pwa_icons] Sharp import notice:', err.message);
  }

  // Fallback: If sharp is not loaded, copy existing icons if present
  if (fs.existsSync(srcFile)) {
    const buf = fs.readFileSync(srcFile);
    fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf);
    fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf);
    fs.writeFileSync(path.join(publicDir, 'icon-maskable-192.png'), buf);
    fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), buf);
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf);
    console.log('[make_pwa_icons] Fallback raw icon write complete');
  }
}

generateExactIcons().catch(console.error);
