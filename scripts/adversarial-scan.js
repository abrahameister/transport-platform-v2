const fs = require('fs');
const path = require('path');

const FORBIDDEN_PATTERNS = [
  'GEMINI_' + 'API_KEY',
  '@google/' + 'genai',
  'SuperAdmin' + 'Context',
  'Operational' + 'Context',
  'ClientPortal' + 'Context',
  'Driver' + 'Context',
  'NEXT_PUBLIC_' + 'SERVICE',
  'supabase ' + 'login',
  'supabase ' + 'link',
  'supabase db ' + 'push',
  'supabase db ' + 'pull',
  'Prisma' + 'Client',
  '@prisma/' + 'client',
  'drizzle-' + 'orm',
  'type' + 'orm',
  'seque' + 'lize',
];

const IGNORED_DIRS = ['.git', 'node_modules', '.next', '.expo', 'dist', 'build', '.turbo', 'scripts'];
const IGNORED_FILES = ['AGENTS.md', 'README.md', 'implementation_plan.md', 'sprint-0-report.md'];

function scanDir(dir, violations = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.includes(file) && !fullPath.includes('docs')) {
        scanDir(fullPath, violations);
      }
    } else {
      if (IGNORED_FILES.includes(file)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');

      for (const pattern of FORBIDDEN_PATTERNS) {
        if (content.includes(pattern)) {
          violations.push({ file: fullPath, pattern });
        }
      }
    }
  }

  return violations;
}

const violations = scanDir(path.resolve(__dirname, '..'));

if (violations.length > 0) {
  console.error('❌ Adversarial Scan Failed! Forbidden patterns found:');
  console.error(violations);
  process.exit(1);
} else {
  console.log('✅ Adversarial Scan Passed! No forbidden patterns or secrets detected.');
  process.exit(0);
}
