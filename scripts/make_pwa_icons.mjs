import fs from 'fs';
import path from 'path';

const srcFile = "C:\\Users\\mathi\\.gemini\\antigravity-ide\\brain\\a91f738a-cd23-43e4-8fbb-99032b87bf70\\thanjai_periya_kovil_app_icon_1786871152054.png";
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  const buf = fs.readFileSync(srcFile);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-192.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf);
  console.log('Successfully generated Thanjai Periya Kovil PWA icons (any & maskable) in public/');
} catch (e) {
  console.error('Error writing icons:', e);
}
