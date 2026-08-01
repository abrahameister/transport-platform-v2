const fs = require('fs');
const path = require('path');

console.log('--- Executing Security & Secret Scan ---');

const projectRoot = path.join(__dirname, '..');
const secretRegexes = [
  /SUPABASE_ADMIN_KEY\s*=\s*['"]?(?!sb_secret_placeholder_local)[a-zA-Z0-9_\-\.]{20,}['"]?/gi,
  /ghp_[a-zA-Z0-9]{36}/gi,
  /aws_secret_access_key\s*=\s*['"]?[a-zA-Z0-9\/+=]{40}['"]?/gi,
];

function scanDirectory(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === '.next' ||
        entry.name === '.expo' ||
        entry.name === 'dist' ||
        entry.name === '.turbo'
      ) {
        continue;
      }
      count += scanDirectory(fullPath);
    } else if (entry.isFile()) {
      if (
        entry.name.endsWith('.png') ||
        entry.name.endsWith('.ico') ||
        entry.name.endsWith('.lock') ||
        entry.name === 'pnpm-lock.yaml' ||
        entry.name.endsWith('.test.ts') ||
        entry.name.endsWith('.test.tsx') ||
        entry.name.endsWith('.spec.ts')
      ) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      for (const regex of secretRegexes) {
        if (regex.test(content)) {
          console.error(
            `[SECURITY VIOLATION DETECTED] Leaked secret pattern found in: ${path.relative(projectRoot, fullPath)}`
          );
          count++;
        }
      }
    }
  }

  return count;
}

const violations = scanDirectory(projectRoot);

if (violations > 0) {
  console.error(`❌ Security Scan Failed: Found ${violations} real secret violation(s).`);
  process.exit(1);
} else {
  console.log('✅ Security Scan Passed: 0 real secrets or production credentials detected.');
  process.exit(0);
}
