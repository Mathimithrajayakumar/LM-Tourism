import fs from 'fs';
import path from 'path';

const sourceImg = "C:\\Users\\mathi\\.gemini\\antigravity-ide\\brain\\a91f738a-cd23-43e4-8fbb-99032b87bf70\\lm_tourism_app_icon_1786870519059.png";
const targetDir = path.resolve('public');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(sourceImg, path.join(targetDir, 'icon-192.png'));
fs.copyFileSync(sourceImg, path.join(targetDir, 'icon-512.png'));
fs.copyFileSync(sourceImg, path.join(targetDir, 'favicon.ico'));
console.log('App icons copied successfully to public/');
