import fs from 'fs';
import path from 'path';

const srcFile = "C:\\Users\\mathi\\.gemini\\antigravity-ide\\brain\\a91f738a-cd23-43e4-8fbb-99032b87bf70\\lm_tourism_app_icon_1786870519059.png";
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  const buf = fs.readFileSync(srcFile);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf);
  console.log('Successfully written PWA icons to public folder');
} catch (e) {
  console.error('Error writing icons:', e);
}
