const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'apps', 'driver', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Valid 1x1 transparent PNG base64 string
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(pngBase64, 'base64');

const files = ['icon.png', 'adaptive-icon.png', 'splash.png', 'favicon.png'];

files.forEach((file) => {
  const filePath = path.join(assetsDir, file);
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated placeholder PNG asset: ${filePath}`);
});
